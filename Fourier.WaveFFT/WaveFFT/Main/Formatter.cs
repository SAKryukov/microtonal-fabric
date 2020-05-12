namespace WaveFFT.Main {
    using System.Reflection;
    using StringList = System.Collections.Generic.List<System.String>;
    using Path = System.IO.Path;
    using File = System.IO.File;

    static class Formatter {

        static class DefinitionSet {
            internal const string templateFile = "Data/template.json";
            internal const string templatePlaceholder = "*";
            internal static readonly string dataIndent = new string(' ', 2 * 4);
            internal static string formatLine(int index, double amplitude, double phase, bool comma) {
                string commaText = comma ? "," : "";
                return $@"{dataIndent}{{""harmonic"": {index}, ""amplitude"": {amplitude}, ""phase"": {phase} }}{commaText}";
            } //formatLine
        } //class DefinitionSet

        public static string[] Format(double[,] data) {
            StringList before, after;
            CreateTemplate(out before, out after);
            var list = new StringList(before);
            int longIndexBound = data.GetUpperBound(1);
            for (var index = 0; index < longIndexBound; ++index)
                list.Add(DefinitionSet.formatLine(index, data[0, index], data[1, index], index < longIndexBound - 1));
            foreach (var line in after) list.Add(line);
            return list.ToArray();
        } //Format

        static void CreateTemplate(out StringList before, out StringList after) {
            var templateFileName = Path.Combine(Path.GetDirectoryName(Assembly.GetEntryAssembly().Location), DefinitionSet.templateFile);
            string[] templateLines = File.ReadAllLines(templateFileName);
            before = new StringList();
            after = new StringList();
            var activeList = before;
            foreach (var line in templateLines)
                if (line.Contains(DefinitionSet.templatePlaceholder))
                    activeList = after;
                else
                    activeList.Add(line);
        } //CreateTemplate

    } //class Formatter

}
