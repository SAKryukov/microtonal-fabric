namespace WaveFFT.View {
    using System.Windows;
    using System.Windows.Input;
    using Path = System.IO.Path;

    public partial class MainWindow : Window {

        static class DefinitionSet {
            internal const string outputFileType = ".json";
            internal const string openDialogFilter = "WAV files|*.wav";
            internal const string saveDialogFilter = "JSON files|" + outputFileType;
            internal const string openDialogTitle = " Open WAV File";
            internal const string saveDialogTitle = " Save Spectrum as Sound Builder JSON File";
            internal static string formatInputFileName(string name) { return $"Input file: {Path.GetFileName(name)}"; }
            internal static string formatFileNames(string inputName, string outputName) { return $"Input file: {Path.GetFileName(inputName)}, output file: {Path.GetFileName(outputName)}"; }
        } //class DefinitionSet

        void ShowSize() {
            int samples = 2 << (int)this.sliderSize.Value;
            this.sliderSizeNotification.Text = samples.ToString();
            double shift = ((int)this.sliderShift.Value);
            this.sliderShiftNotification.Text = shift.ToString();
            if (this.wave == null) return;
            double width = 1.0 * samples / this.wave.SampleCount;
            double guideShift = 1.0 * shift / this.wave.SampleCount;
            double x1 = guideShift;
            double x2 = guideShift + width;
            this.canvasTime.ClearGuides();
            this.canvasTime.AddGuide(x1, System.Windows.Controls.Orientation.Vertical, System.Windows.Media.Brushes.Red);
            this.canvasTime.AddGuide(x2, System.Windows.Controls.Orientation.Vertical, System.Windows.Media.Brushes.Red);
        } //ShowSize

        public MainWindow() {
            InitializeComponent();
            Title = Main.UtilitySet.ProductName;

            this.canvasTime.Domain = new Visualization.Domain(0, 1, -1, 1);
            this.canvasFrequency.Domain = new Visualization.Domain(0, 1, 0, 1);
            this.canvasPhase.Domain = new Visualization.Domain(0, 1, -1.2, 1.2);

            this.sliderSize.ValueChanged += (target, eventArgs) => { ShowSize(); };
            this.sliderShift.ValueChanged += (target, eventArgs) => { ShowSize(); };
            ShowSize();
            openDialog.Title = DefinitionSet.openDialogTitle;
            saveDialog.Title = DefinitionSet.saveDialogTitle;
            openDialog.Filter = DefinitionSet.openDialogFilter;
            saveDialog.Filter = DefinitionSet.saveDialogFilter;
            void setInitialDirectory(Microsoft.Win32.FileDialog[] dialogs) {
                var args = System.Environment.GetCommandLineArgs();
                if (args.Length == 2)
                    foreach (var dialog in dialogs)
                        dialog.InitialDirectory = args[1];
            };
            setInitialDirectory(new Microsoft.Win32.FileDialog[] { openDialog, saveDialog });
            CommandBindings.Add(new CommandBinding(
                ApplicationCommands.Open,
                (target, eventArgs) => { this.LoadWav(); },
                (target, eventArgs) => { eventArgs.CanExecute = true; }));
            CommandBindings.Add(new CommandBinding(
                ApplicationCommands.Save,
                (target, eventArgs) => { this.CreateFft(); },
                (target, eventArgs) => { eventArgs.CanExecute = this.wavFileName != null; }));
            CommandBindings.Add(new CommandBinding(
                ApplicationCommands.Help,
                (target, eventArgs) => { help.ShowDialog(); }));
            this.sliderSize.Focus();
        } //MainWindow

        protected override void OnClosed(System.EventArgs e) {
            help.CloseApplication();
        } //OnClosed

        void LoadWav() {
            if (openDialog.ShowDialog() != true) return;
            wavFileName = openDialog.FileName;
            this.wave = new Main.WaveFile(wavFileName);
            this.canvasTime.SetData(wave.LeftChannel, System.Windows.Media.Brushes.Black, true);
            this.canvasTime.AddGuide(0.3, System.Windows.Controls.Orientation.Vertical, System.Windows.Media.Brushes.Red);
            this.sliderSize.Maximum = Main.Processor.FitBufferSize(this.wave.SampleCount);
            this.sliderShift.Maximum = wave.SampleCount;
            ShowSize();
            void reportMetadata() {
                string declaredSampleCount = string.Empty;
                if (this.wave.DeclaredSampleCount != this.wave.SampleCount)
                    declaredSampleCount = $" (declared sample count: {this.wave.DeclaredSampleCount})";
                this.textBlockAudioProperties.Text = $"Sample count {this.wave.SampleCount}, channels: {this.wave.ChannelCount}";
            } //reportMetadata
            reportMetadata();
            this.footer.Text = DefinitionSet.formatInputFileName(wavFileName);
        } //LoadWav

        void CreateFft() {
            if (wavFileName != null)
                saveDialog.FileName = Path.ChangeExtension(wavFileName, DefinitionSet.outputFileType);
            if (saveDialog.ShowDialog() != true) return;
            this.result = Main.Processor.Perform(wave.LeftChannel, 2 << (int)this.sliderSize.Value, (int)this.sliderShift.Value);
            this.canvasFrequency.SetData(Main.Processor.GetAmplitude(result), System.Windows.Media.Brushes.Navy, true);
            this.canvasPhase.SetData(Main.Processor.GetPhase(result), System.Windows.Media.Brushes.DarkCyan, true);
            var fileContent = Main.Formatter.Format(result);
            System.IO.File.WriteAllLines(saveDialog.FileName, fileContent);
            this.footer.Text = DefinitionSet.formatFileNames(wavFileName, saveDialog.FileName);
        } //CreateFft

        string wavFileName = null;
        HelpAbout help = new HelpAbout();
        Main.WaveFile wave;
        double[,] result;
        Microsoft.Win32.OpenFileDialog openDialog = new Microsoft.Win32.OpenFileDialog();
        Microsoft.Win32.SaveFileDialog saveDialog = new Microsoft.Win32.SaveFileDialog();

    } //class MainWindow

}
