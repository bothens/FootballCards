namespace Application_Layer.Common.Exceptions
{
    public sealed class ForbiddenException : Exception
    {
        public ForbiddenException(string message) : base(message) { }

        public static ForbiddenException Default()
            => new("You are not allowed to perform this action.");
    }
}
