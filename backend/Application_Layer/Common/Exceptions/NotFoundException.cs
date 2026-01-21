namespace Application_Layer.Common.Exceptions
{
    public sealed class NotFoundException : Exception
    {
        public NotFoundException(string message) : base(message) { }

        public static NotFoundException For(string resource, object key)
            => new($"{resource} with key '{key}' was not found.");
    }
}
