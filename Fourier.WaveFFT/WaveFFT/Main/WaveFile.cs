namespace WaveFFT.Main {
    using System;
	using System.IO;

    internal class WaveFile {

        internal WaveFile(string fileName) {
            readWav(fileName);
        } //WaveFile

        internal int DeclaredSampleCount { get; private set; }
        internal int SampleCount { get; private set; }
        internal bool IsAcceptableDataSize { get; private set; }
        internal int ChannelCount { get; private set; }

        double[] left = null, right = null;
        internal double[] LeftChannel { get { return this.left; } }
        internal double[] RightChannel { get { return this.right; } }

        void readWav(string filename) {
            using (FileStream fs = File.Open(filename, FileMode.Open)) {
                BinaryReader reader = new BinaryReader(fs);
                int chunkID = reader.ReadInt32();
                int fileSize = reader.ReadInt32();
                int riffType = reader.ReadInt32();
                int formatId = reader.ReadInt32();
                int formatSize = reader.ReadInt32();
                int formatCode = reader.ReadInt16();
                int formatChannels = reader.ReadInt16();
                this.ChannelCount = formatChannels;
                int formatSampleRate = reader.ReadInt32();
                int formatAverageBps = reader.ReadInt32();
                int formatBlockAlignment = reader.ReadInt16();
                int formatBitDepth = reader.ReadInt16();
                if (formatSize == 18) { //read extra values:
                    int fmtExtraSize = reader.ReadInt16();
                    reader.ReadBytes(fmtExtraSize);
                }
                int dataId = reader.ReadInt32();
                int dataSize = (int)reader.ReadUInt32();
                byte[] byteArray = reader.ReadBytes(dataSize);
                int bytesForSamp = formatBitDepth / 8;
                this.DeclaredSampleCount = dataSize / bytesForSamp;
                dataSize = byteArray.Length;
                int samps = dataSize / bytesForSamp;
                this.SampleCount = samps / 2;
                this.IsAcceptableDataSize = dataSize % bytesForSamp == 0;
                double[] asDouble = null;
                if (formatBitDepth == 64) {
                    asDouble = new double[samps];
                    Buffer.BlockCopy(byteArray, 0, asDouble, 0, dataSize);
                } else if (formatBitDepth == 32) {
                    float[] asFloat = new float[samps];
                    Buffer.BlockCopy(byteArray, 0, asFloat, 0, dataSize);
                    asDouble = Array.ConvertAll<float, double>(asFloat, e => 1.0 * e);
                } else if (formatBitDepth == 16) {
                    Int16[] asInt16 = new Int16[samps];
                    Buffer.BlockCopy(byteArray, 0, asInt16, 0, dataSize); //SA???
                    asDouble = Array.ConvertAll<Int16, double>(asInt16, e => e / (double)Int16.MaxValue);
                } else
                    throw new System.ApplicationException($"Invalid bit depth: {formatBitDepth}");
                if (formatChannels == 1) {
                    this.left = asDouble;
                    this.right = null;
                } else if (formatChannels == 2) {
                    this.left = new double[samps / 2];
                    this.right = new double[samps / 2];
                    for (int index = 0, s = 0; index < samps / 2; ++index) {
                        this.left[index] = asDouble[s++];
                        this.right[index] = asDouble[s++];
                    }
                } else
                    throw new System.ApplicationException($"Invalid number of channels: {formatChannels}");
            } //using
        } //readWav

    } //class WaveFile

} //namespace Fourier
