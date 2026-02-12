using Domain_Layer.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure_Layer.Data.Configurations
{
    public sealed class PlayerConfiguration : IEntityTypeConfiguration<Player>
    {
        public void Configure(EntityTypeBuilder<Player> builder)
        {
            builder.HasKey(x => x.Id);

            builder.Property(x => x.Name)
                .IsRequired()
                .HasMaxLength(120);

            //builder.Property(x => x.Team)
            //    .IsRequired()
            //    .HasMaxLength(120);

            builder.Property(x => x.Position)
                .IsRequired()
                .HasMaxLength(40);

            builder.Property(x => x.ImageUrl)
                .HasMaxLength(500);

            //builder.Property(x => x.CreatedAt)
            //    .IsRequired();

            //builder.HasMany(x => x.Transactions)
            //    .WithOne(x => x.Player)
            //    .HasForeignKey(x => x.PlayerId)
            //    .OnDelete(DeleteBehavior.Restrict);

            //builder.HasIndex(x => x.Team);
            builder.HasIndex(x => x.Position);
        }
    }
}
