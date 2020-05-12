namespace WaveFFT.Main {
	using Math = System.Math;
	using Array = System.Array;

	static class Processor {

		public static int FitBufferSize(int fullSize) {
			int degree = 1;
			do degree += 1; while (fullSize > 2 << degree);
			if (2 << degree > fullSize) --degree;
			return degree;
		} //FitBufferSize

		public static double[,] Perform(double[] real, int smallerSize, int shift) {
			if (smallerSize > real.Length) smallerSize = real.Length;
			double[] shortened = new double[smallerSize];
			Array.Copy(real, shift, shortened, 0, smallerSize);
			var LomontArray = CreateLomontArray(shortened);
			var fft = new Lomont.LomontFFT();
			fft.FFT(LomontArray, true);
			var split = SplitIntoComplex(LomontArray);
			var max = NormalizeArray(split);
			convertToAmplitudePhase(split);
			return split;
		} //Perform

		public static double[] GetAmplitude(double[,] values) {
			int longIndexBound = values.GetUpperBound(1);
			var result = new double[longIndexBound];
			for (var index = 0; index < longIndexBound; ++index)
				result[index] = values[0, index];
			return result;
		}
		public static double[] GetPhase(double[,] values) {
			int longIndexBound = values.GetUpperBound(1);
			var result = new double[longIndexBound];
			for (var index = 0; index < longIndexBound; ++index)
				result[index] = values[1, index];
			return result;
		}

		static double[] CreateLomontArray(double[] real) { // insert interlaced IM = 0;
			int degree = FitBufferSize(real.Length);
			int size = 2 << degree;
			double[] result = new double[size * 2];
			for (int index = 0; index < size; ++index)
				result[index * 2] = real[index];
			return result;
		} //CreateLomontArray

		static double[,] SplitIntoComplex(double[] lomontArray) {
			int halfSize = lomontArray.Length / 2;
			double[,] result = new double[2, halfSize];
			for (int index = 0; index < halfSize; ++index) {
				result[0, index] = lomontArray[index * 2];
				result[1, index] = lomontArray[index * 2 + 1];
			} //loop
			return result;
		} //SplitIntoComplex

		static int NormalizeArray(double[,] result) {
			double max = double.NegativeInfinity;
			int maxIndex = 0;
			int longIndexBound = result.GetUpperBound(1);
			for (var index = 0; index <= longIndexBound; ++index) {
				double re = result[0, index];
				double im = result[1, index];
				double absValue = Math.Sqrt(re * re + im * im);
				if (absValue > max) {
					max = absValue;
					maxIndex = index;
				} //if
			} //loop
			for (var reimIndex = 0; reimIndex <= 1; ++reimIndex)
				for (var index = 0; index <= longIndexBound; ++index)
					result[reimIndex, index] /= max;
			return maxIndex;
		} //NormalizeArray

		static void convertToAmplitudePhase(double[,] result) {
			int longIndexBound = result.GetUpperBound(1);
			for (var index = 0; index < longIndexBound; ++index) {
				double re = result[0, index];
				double im = result[1, index];
				double absValue = Math.Round(Math.Sqrt(re * re + im * im) * 100);
				double phase = Math.Round(Math.Atan2(re, im) * 180 / Math.PI);
				result[0, index] = absValue;
				result[1, index] = phase;
			} //loop
		} //convertToAmplitudePhase

	} //class Processor

}
