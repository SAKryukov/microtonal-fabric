namespace WaveFFT.View {
    using System.Windows;

    public partial class HelpAbout : Window {

        internal class StaticModel {
            public string ProductName => Main.UtilitySet.ProductName;
            public string Copyright => Main.UtilitySet.Copyright;
            public string Version => $"v.{Main.UtilitySet.HairSpace}{Main.UtilitySet.Version.Major}.{Main.UtilitySet.Version.Minor}";
            public string MicrotonalStudyTitle => "Microtonal Music Study";
            public string MicrotonalStudy => "https://sakryukov.github.io/microtonal-chromatic-lattice-keyboard";
            public string CreditsTitle => "Chris Lomont: LomontFFT:";
            public string CreditsUrl => "http://lomont.org/software/misc/fft/LomontFFT.html";
        } //class StaticModel

        public HelpAbout() {
            InitializeComponent();
            this.DataContext = new StaticModel();
        } //HelpAbout

        protected override void OnClosing(System.ComponentModel.CancelEventArgs e) {
            if (!closingApplication) {
                e.Cancel = true;
                Hide();
            } else
                base.OnClosing(e);
        } //OnClosing

        internal void CloseApplication() {
            closingApplication = true;
            Close();
        } //CloseApplication
        bool closingApplication = false;

        protected override void OnContentRendered(System.EventArgs e) { 
            base.OnContentRendered(e);
            MinWidth = ActualWidth;
            MinHeight = ActualHeight;
        }
        protected override void OnRenderSizeChanged(SizeChangedInfo sizeInfo) {
            base.OnRenderSizeChanged(sizeInfo);
            //Title = $"{sizeInfo.NewSize.Width}: {sizeInfo.NewSize.Height}";
        }

    } //class HelpAbout

}
