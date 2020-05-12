namespace WaveFFT.Main {
    using System.Reflection;

    static class UtilitySet {

        internal static string ProductName { get {
                object[] attributes =
                    Assembly.GetCustomAttributes(typeof(AssemblyProductAttribute), false);
                if (attributes == null) return null;
                if (attributes.Length < 1) return null;
                return ((System.Reflection.AssemblyProductAttribute)attributes[0]).Product;
            }
        }

        internal static string Copyright {
            get {
                object[] attributes =
                    Assembly.GetCustomAttributes(typeof(AssemblyCopyrightAttribute), false);
                if (attributes == null) return null;
                if (attributes.Length < 1) return null;
                return ((System.Reflection.AssemblyCopyrightAttribute)attributes[0]).Copyright;
            }
        }

        internal static System.Version Version { get {
                object[] attributes = Assembly.GetCustomAttributes(typeof(AssemblyFileVersionAttribute), false);
                if (attributes == null) return null;
                if (attributes.Length < 1) return null;
                return new System.Version(((AssemblyFileVersionAttribute)attributes[0]).Version);
            }
        }

        internal static string HairSpace => char.ConvertFromUtf32(0x200A);

    private static Assembly Assembly => Assembly.GetEntryAssembly();

    } //class UtilitySet

}
