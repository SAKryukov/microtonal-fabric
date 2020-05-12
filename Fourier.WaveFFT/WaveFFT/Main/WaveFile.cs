namespace WaveFFT.Main {
    using System;
	using System.IO;

    internal class WaveFile {

        public WaveFile(string fileName) {
            readWav(fileName);
        } //WaveFile

        public int DeclaredSampleCount { get; private set; }
        public int SampleCount { get; private set; }
        public bool IsAcceptableDataSize { get; private set; }
        public int ChannelCount { get; private set; }

        double[] left = null, right = null;
        public double[] LeftChannel { get { return this.left; } }
        public double[] RightChannel { get { return this.right; } }

        void readWav(string filename) {
            using (FileStream fs = File.Open(filename, FileMode.Open)) {
                BinaryReader reader = new BinaryReader(fs);
                int chunkID = reader.ReadInt32();
                int fileSize = reader.ReadInt32();
                int riffType = reader.ReadInt32();
                int fmtID = reader.ReadInt32();
                int fmtSize = reader.ReadInt32();
                int fmtCode = reader.ReadInt16();
                int fmtChannels = reader.ReadInt16();
                this.ChannelCount = fmtChannels;
                int fmtSampleRate = reader.ReadInt32();
                int fmtAvgBPS = reader.ReadInt32();
                int fmtBlockAlign = reader.ReadInt16();
                int fmtBitDepth = reader.ReadInt16();
                if (fmtSize == 18) { //read extra values:
                    int fmtExtraSize = reader.ReadInt16();
                    reader.ReadBytes(fmtExtraSize);
                }
                int dataID = reader.ReadInt32();
                int dataSize = (int)reader.ReadUInt32();
                byte[] byteArray = reader.ReadBytes(dataSize);
                int bytesForSamp = fmtBitDepth / 8;
                this.DeclaredSampleCount = dataSize / bytesForSamp;
                dataSize = byteArray.Length;
                int samps = dataSize / bytesForSamp;
                this.SampleCount = samps / 2;
                this.IsAcceptableDataSize = dataSize % bytesForSamp == 0;
                double[] asDouble = null;
                if (fmtBitDepth == 64) {
                    asDouble = new double[samps];
                    Buffer.BlockCopy(byteArray, 0, asDouble, 0, dataSize);
                } else if (fmtBitDepth == 32) {
                    float[] asFloat = new float[samps];
                    Buffer.BlockCopy(byteArray, 0, asFloat, 0, dataSize);
                    asDouble = Array.ConvertAll<float, double>(asFloat, e => 1.0 * e);
                } else if (fmtBitDepth == 16) {
                    Int16[] asInt16 = new Int16[samps];
                    Buffer.BlockCopy(byteArray, 0, asInt16, 0, dataSize); //SA???
                    asDouble = Array.ConvertAll<Int16, double>(asInt16, e => e / (double)Int16.MaxValue);
                } else
                    throw new System.ApplicationException($"Invalid bit depth: {fmtBitDepth}");
                if (fmtChannels == 1) {
                    this.left = asDouble;
                    this.right = null;
                } else if (fmtChannels == 2) {
                    this.left = new double[samps / 2];
                    this.right = new double[samps / 2];
                    for (int index = 0, s = 0; index < samps / 2; ++index) {
                        this.left[index] = asDouble[s++];
                        this.right[index] = asDouble[s++];
                    }
                } else
                    throw new System.ApplicationException($"Invalid number of channels: {fmtChannels}");
            } //using
        } //readWav

    } //class WaveFile

} //namespace Fourier

