namespace Visualization {
	using System.Windows;
	using System.Windows.Shapes;
	using PlotList = System.Collections.Generic.List<Plot.PlotElement>;
	using GuideList = System.Collections.Generic.List<Plot.GuideElement>;
	using System.Windows.Media;
    using System.Windows.Controls;

	class Plot : Canvas {

		internal void SetData(double[] points, Brush fill, bool normalize) {
			double[] average(double[] fullData, int chunks) {
				double min = double.PositiveInfinity;
				double max = double.NegativeInfinity;
				double[] result = new double[chunks];
				int chunkSize = fullData.Length / chunks;
				for (int chunkIndex = 0; chunkIndex < chunks; ++chunkIndex) {
					double sum = 0;
					int count = 0;
					int chunkStart = chunkIndex * chunkSize;
					for (int index = chunkIndex * chunkSize; index < chunkStart + chunkSize && index < fullData.Length; ++index) {
						double point = fullData[index];
						sum += point;
						++count;
					} //loop
					result[chunkIndex] = sum / count;
				} //loop
				if (normalize) {
					for (var index = 0; index < result.Length; ++index) {
						var point = result[index];
						point *= point;
						if (point > max) max = point;
						if (point < min) min = point;
					} //loop
					max = System.Math.Sqrt(max);
					min = System.Math.Sqrt(min);
					for (var index = 0; index < result.Length; ++index)
						result[index] = result[index] / (max - min);
				} //if normalize
				return result;
			} //average
			foreach (var item in this.pointList)
				this.Children.Remove(item.Implementation);
			this.pointList.Clear();
			int steps = points.Length > (int)this.ActualWidth ? (int)this.ActualWidth : points.Length;
			points = average(points, steps);
			double step = (this.Domain.Right - this.Domain.Left) / points.Length;
			for (var index = 0; index < points.Length; ++index) {
				var domain = new Domain(index * step, (index + 1) * step, 0, points[index]);
				var element = new PlotElement(this, domain, fill);
				pointList.Add(element);
			} //loop
			this.ResizeHandler();
		} //SetData

		internal void AddGuide(double value, Orientation orientation, Brush lineBrush) {
			guideList.Add(new GuideElement(this, value, orientation, lineBrush));
			this.ResizeHandler();
		} //AddGuide
		internal void ClearGuides() {
			foreach (var child in this.guideList)
				this.Children.Remove(child.Implementation);
			guideList.Clear();
			this.ResizeHandler();
		} //ClearGuides

		internal Domain Domain { get; set; }
		PlotList pointList = new PlotList();
		GuideList guideList = new GuideList();

		internal class PlotElement {
			internal PlotElement(Canvas parent, Domain mathematical, Brush brush) {
				this.Mathematical = mathematical;
				Implementation = new Rectangle();
				Implementation.Fill = brush;
				parent.Children.Add(Implementation);
			}
			internal Domain Mathematical;
			internal Rectangle Implementation;
		} //class PlotElement
		internal class GuideElement {
			internal GuideElement(Canvas parent, double value, Orientation orientation, Brush brush) {
				if (orientation == Orientation.Horizontal)
					Mathematical = new Point(double.NaN, value);
				else
					Mathematical = new Point(value, double.NaN);
				Implementation = new Line();
				Implementation.StrokeThickness = 1;
				Implementation.Stroke = brush;
				parent.Children.Add(Implementation);
			} //GuideElement
			internal Point Mathematical;
			internal Line Implementation;
		} //class GuideElement

		public Plot() {
			this.SizeChanged += (target, eventArgs) => { this.ResizeHandler(); };
		} //Plot

		void ResizeHandler() {
			foreach (var child in this.guideList) {
				if (!double.IsNaN(child.Mathematical.X)) {
					child.Implementation.Y1 = 0;
					child.Implementation.Y2 = this.ActualHeight;
					var left = worldToClient(new Point(child.Mathematical.X, 0));
					child.Implementation.X1 = child.Implementation.X2 = left.X;
				} else {
					child.Implementation.X1 = 0;
					child.Implementation.X2 = this.ActualWidth;
					var left = worldToClient(new Point(child.Mathematical.Y, 0));
					child.Implementation.Y1 = child.Implementation.Y2 = left.Y;
				}; //if orientation;
			} //loop
			foreach (var child in this.pointList) {
				var leftTop = worldToClient(new Point(child.Mathematical.Left, child.Mathematical.Top));
				var rightBottom = worldToClient(new Point(child.Mathematical.Right, child.Mathematical.Bottom));
				Canvas.SetLeft(child.Implementation, leftTop.X);
				Canvas.SetTop(child.Implementation, leftTop.Y);
				child.Implementation.Width = rightBottom.X - leftTop.X;
				child.Implementation.Height = rightBottom.Y - leftTop.Y;
			} //loop
		} //ResizeHandler

		Point worldToClient(Point point) {
			return new Point(
				this.ActualWidth * (point.X - Domain.XFrom) / Domain.Width,
				this.ActualHeight - this.ActualHeight * ((point.Y - Domain.YFrom) / Domain.Height)
			);
		} //worldToClient
		Point clientToWorld(Point point, Size oldCanvasSize, ref Domain oldDomain) {
			return new Point(
				point.X * oldDomain.Width / oldCanvasSize.Width + oldDomain.XFrom,
				oldDomain.YFrom + oldDomain.Height * (1 - point.Y / oldCanvasSize.Height)
			);
		} //clientToWorld

	} //class Plot

}
