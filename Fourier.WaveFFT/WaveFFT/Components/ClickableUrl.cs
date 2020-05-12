namespace Components {
    using System.Diagnostics;

    public class ClickableUrl : System.Windows.Controls.TextBlock {

       public ClickableUrl() {
            this.TextDecorations.Add(System.Windows.TextDecorations.Underline);
            this.Foreground = System.Windows.Media.Brushes.Navy;
            this.MouseDown += (sender, eventArgs) => {
                string url = (this.Tag != null && this.Tag is System.String) ? (string)Tag : Text;
                Process.Start(new ProcessStartInfo(url) { UseShellExecute = true });
            };
        }

    } //class ClickableUrl

}
