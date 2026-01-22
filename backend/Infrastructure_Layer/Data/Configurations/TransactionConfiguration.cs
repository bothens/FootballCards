using Domain_Layer.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure_Layer.Data.Configurations
{
    public sealed class TransactionConfiguration : IEntityTypeConfiguration<Transaction>
    {
        public void Configure(EntityTypeBuilder<Transaction> builder)
        {
            builder.HasKey(x => x.Id);

            builder.Property(x => x.UserId)
                .IsRequired();

            builder.Property(x => x.PlayerId)
                .IsRequired();

            builder.Property(x => x.Type)
                .IsRequired()
                .HasMaxLength(10);

            builder.Property(x => x.Quantity)
                .IsRequired();

            builder.Property(x => x.PricePerUnit)
                .HasColumnType("decimal(18,2)")
                .IsRequired();

            builder.Property(x => x.Total)
                .HasColumnType("decimal(18,2)")
                .IsRequired();

            builder.Property(x => x.CreatedAt)
                .IsRequired();

            builder.HasIndex(x => x.UserId);
            builder.HasIndex(x => x.PlayerId);
            builder.HasIndex(x => x.CreatedAt);
        }
    }
}
