namespace Visualization {
	using Numeric = System.Double;
	using Cardinal = System.UInt64;
	using IFormattable = System.IFormattable;
	using IFormatProvider = System.IFormatProvider;

	[System.Flags]
	public enum PlotStyle { Line = 1, Markers = 2, }

	public interface IVisualizer {
		Domain Domain { get; }
		void AddPoint(WorldPoint point, bool first);
		void MarkPoint(WorldPoint point, bool first);
		PlotStyle RecommendedStyle { get; }
		Cardinal RecommendedPointCount { get; }
		string Name { get; set; }
	} //interface IVisualizer

	public interface IFunctionAttributeSet {
		PlotStyle Style { get; }
		Cardinal PointCount { get; }
		Numeric[] Min { get; }
		Numeric[] Max { get; }
	} //interface IFunctionAttributeSet
	public interface IFunctionPresentation : IFunctionAttributeSet {
		void Show(IVisualizer visualizer);
		Numeric[] GetPoint(params Numeric[] arguments);
		Numeric[] GetPoint(int pointNumber);
	} //interface IFunctionPresentation

	public struct WorldPoint : IFormattable {
		public WorldPoint(Numeric x, Numeric y) { X = x; Y = y; }
		public override string ToString() {
			return string.Format("{{{0}, {1}}}", X, Y);
		} //ToString
		string IFormattable.ToString(string format, IFormatProvider formatProvider) {
			return string.Format(formatProvider, format, X, Y);
		} //IFormattable.ToString
		public static implicit operator Numeric[](WorldPoint source) { return new Numeric[] { source.X, source.Y }; } 
		public Numeric X;
		public Numeric Y;
	} //WorldPoint

	[System.ComponentModel.TypeConverter(typeof(DomainConverter))]
	public struct Domain : IFormattable {
		public Domain(Numeric xFrom, Numeric xTo, Numeric yFrom, Numeric yTo) {
			if (xFrom < xTo) {
				x0 = xFrom; x = xTo;
			} else {
				x = xFrom; x0 = xTo;
			} //if
			if (yFrom < yTo) {
				y0 = yFrom; y = yTo;
			} else {
				y = yFrom; y0 = yTo;
			} //if
		} //Domain
		public override bool Equals(object obj) {
			Domain another = (Domain)obj;
			return this.XFrom == another.XFrom &&
				this.XTo == another.XTo &&
				this.YFrom == another.YFrom &&
				this.YTo == another.YTo; 
		} //Equals
		public override int GetHashCode() {
			return XFrom.GetHashCode() ^ XTo.GetHashCode() ^ YFrom.GetHashCode() ^ YTo.GetHashCode();
		} //GetHashCode
		public Numeric Width { get { return x - x0; } }
		public Numeric Height { get { return y - y0; } }
		public Numeric Left { get { return x0; } }
		public Numeric Right { get { return x; } }
		public Numeric Top { get { return y; } }
		public Numeric Bottom { get { return y0; } }
		public Numeric XFrom { get { return x0; } }
		public Numeric XTo { get { return x; } }
		public Numeric YFrom { get { return y0; } }
		public Numeric YTo { get { return y; } }
		public void Union(ref Domain region) {
			UnionX(ref region);
			UnionY(ref region);
		} //Union
		public void UnionX(ref Domain domain) {
			if (x0 < x) {
				if (domain.x0 < x0) x0 = domain.x0;
				if (domain.x > x) x = domain.x;
			} else {
				if (domain.x0 > x0) x0 = domain.x0;
				if (domain.x < x) x = domain.x;
			} //if
		} //UnionX
		public void UnionY(ref Domain domain) {
			if (y0 < y) {
				if (domain.y0 < y0) y0 = domain.y0;
				if (domain.y > y) y = domain.y;
			} else {
				if (domain.y0 > y0) y0 = domain.y0;
				if (domain.y < y) y = domain.y;
			} //if
		} //UnionY
		public override string ToString() {
			return string.Format("x: {0}.. {1}, y: {2}.. {3}", x0, x, y0, y);
		} //ToString
		string IFormattable.ToString(string format, IFormatProvider formatProvider) {
			return string.Format(formatProvider, format, x0, x, y0, y);
		} //IFormattable.ToString
		Numeric x0, x, y0, y;
	} //struct Domain

	class DomainConverter : System.ComponentModel.TypeConverter {
		public override bool CanConvertFrom(System.ComponentModel.ITypeDescriptorContext context, System.Type sourceType) {
			return sourceType == typeof(string);
		} //CanConvertFrom
		public override object ConvertFrom(System.ComponentModel.ITypeDescriptorContext context, System.Globalization.CultureInfo culture, object value) {
			string[] extrema = ((string)value).Split(new char[] { ' ' }, System.StringSplitOptions.RemoveEmptyEntries);
			return new Domain(Numeric.Parse(extrema[0]), Numeric.Parse(extrema[1]), Numeric.Parse(extrema[2]), Numeric.Parse(extrema[3]));
		} //ConvertFrom
		public override bool CanConvertTo(System.ComponentModel.ITypeDescriptorContext context, System.Type destinationType) {
			return destinationType == typeof(string);
		} //CanConvertTo
		public override object ConvertTo(System.ComponentModel.ITypeDescriptorContext context, System.Globalization.CultureInfo culture, object value, System.Type destinationType) {
			Domain domainValue = (Domain)value;
			return string.Format("{0} {1} {2} {3}", domainValue.XFrom, domainValue.XTo, domainValue.YFrom, domainValue.YTo);
		} //ConvertTo
	} //class DomainConverter

	public class InterfaceDefinitionSet {
		public static readonly Domain defaultDomainValue = new Domain(-1, 1, -1, 1);
	} //class InterfaceDefinitionSet

} //namespace