using Domain_Layer.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure_Layer.Data.Configurations
{
    public sealed class PriceHistoryConfiguration : IEntityTypeConfiguration<PriceHistory>
    {
        public void Configure(EntityTypeBuilder<PriceHistory> builder)
        {
            builder.HasKey(x => x.Id);

            builder.Property(x => x.PlayerId)
                .IsRequired();

            builder.Property(x => x.Price)
                .HasColumnType("decimal(18,2)")

                .IsRequired();

            builder.Property(x => x.Timestamp)
                .IsRequired();

            builder.HasIndex(x => x.PlayerId);
            builder.HasIndex(x => x.Timestamp);
        }
    }
}