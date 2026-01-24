using Domain_Layer.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure_Layer.Data.Configurations
{
    public sealed class UserConfiguration : IEntityTypeConfiguration<User>
    {
        public void Configure(EntityTypeBuilder<User> builder)
        {
            builder.ToTable("User", "dbo");

            builder.HasKey(u => u.UserId); 

            builder.Property(u => u.UserId)
                   .ValueGeneratedOnAdd();

            



            builder.Property(x => x.Email)
                .IsRequired()
                .HasMaxLength(256);

            builder.HasIndex(x => x.Email)
                .IsUnique();

            builder.Property(x => x.PasswordHash)
                .IsRequired()
                .HasMaxLength(500);

            builder.Property(x => x.DisplayName)
                .IsRequired()
                .HasMaxLength(80);

            builder.Property(x => x.CreatedAt)
                .IsRequired();

            builder.Property(x => x.ImageUrl)
                .HasMaxLength(500)
                .IsRequired(false);

            builder.Property(x => x.UserRole)
                .IsRequired()
                .HasMaxLength(50)
                .HasDefaultValue("user");

            //builder.HasMany(x => x.Portfolios)
            //    .WithOne(x => x.User)
            //    .HasForeignKey(x => x.UserId)
            //    .OnDelete(DeleteBehavior.Cascade);

            //builder.HasMany(x => x.Transactions)
            //    .WithOne(x => x.User)
            //    .HasForeignKey(x => x.UserId)
            //    .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
