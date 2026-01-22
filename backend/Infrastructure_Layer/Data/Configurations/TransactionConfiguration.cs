using Domain_Layer.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure_Layer.Data.Configurations
{
    public sealed class TransactionConfiguration : IEntityTypeConfiguration<Transaction>
    {
        public void Configure(EntityTypeBuilder<Transaction> builder)
        {
            builder.HasKey(x => x.TransactionId);

            builder.Property(x => x.CardId)
                .IsRequired();

            builder.Property(x => x.BuyerId)
                .IsRequired();

            builder.Property(x => x.SellerId)
                .IsRequired();

            builder.Property(x => x.Price)
                .HasColumnType("decimal(18,2)")
                .IsRequired();

            builder.Property(x => x.Date)
                .IsRequired();

            builder.HasIndex(x => x.BuyerId);
            builder.HasIndex(x => x.SellerId);
            builder.HasIndex(x => x.CardId);
            builder.HasIndex(x => x.Date);
        }
    }
}
