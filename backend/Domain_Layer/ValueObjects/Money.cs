namespace Domain_Layer.ValueObjects
{
    public readonly struct Money
    {
        public decimal Amount { get; }

        public Money(decimal amount)
        {
            Amount = amount;
        }

        public static implicit operator decimal(Money money) => money.Amount;
        public static implicit operator Money(decimal amount) => new(amount);
    }
}
