using System.Security.Cryptography;
using Application_Layer.Common.Interfaces;

namespace Infrastructure_Layer.Auth
{
    public sealed class PasswordHasher : IPasswordHasher
    {
        private const int SaltSize = 16;
        private const int KeySize = 32;
        private const int DefaultIterations = 100_000;

        public string Hash(string password)
        {
            var salt = RandomNumberGenerator.GetBytes(SaltSize);
            var hash = Rfc2898DeriveBytes.Pbkdf2(
                password,
                salt,
                DefaultIterations,
                HashAlgorithmName.SHA256,
                KeySize);

            return $"PBKDF2${DefaultIterations}${Convert.ToBase64String(salt)}${Convert.ToBase64String(hash)}";
        }

        public bool Verify(string password, string hash)
        {
            if (string.IsNullOrWhiteSpace(hash))
            {
                return false;
            }

            var parts = hash.Split('$');
            if (parts.Length != 4 || parts[0] != "PBKDF2")
            {
                return false;
            }

            if (!int.TryParse(parts[1], out var iterations))
            {
                return false;
            }

            var salt = Convert.FromBase64String(parts[2]);
            var expected = Convert.FromBase64String(parts[3]);
            var actual = Rfc2898DeriveBytes.Pbkdf2(
                password,
                salt,
                iterations,
                HashAlgorithmName.SHA256,
                expected.Length);

            return CryptographicOperations.FixedTimeEquals(actual, expected);
        }
    }
}
