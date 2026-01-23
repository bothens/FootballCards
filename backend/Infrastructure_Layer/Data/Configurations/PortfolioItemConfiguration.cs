//using Domain_Layer.Relations;
//using Microsoft.EntityFrameworkCore;
//using Microsoft.EntityFrameworkCore.Metadata.Builders;

//namespace Infrastructure_Layer.Data.Configurations
//{
//    public sealed class PortfolioItemConfiguration : IEntityTypeConfiguration<PortfolioItem>
//    {
//        public void Configure(EntityTypeBuilder<PortfolioItem> builder)
//        {
//            builder.HasKey(x => new { x.PortfolioId, x.PlayerId });

//            builder.Property(x => x.Quantity)
//                .IsRequired();

//            builder.Property(x => x.AvgBuyPrice)
//                .HasColumnType("decimal(18,2)")
//                .IsRequired();

//            builder.HasOne(x => x.Portfolio)
//                .WithMany(x => x.Items)
//                .HasForeignKey(x => x.PortfolioId)
//                .OnDelete(DeleteBehavior.Cascade);

//            builder.HasOne(x => x.Player)
//                .WithMany()
//                .HasForeignKey(x => x.PlayerId)
//                .OnDelete(DeleteBehavior.Restrict);

//            builder.HasIndex(x => x.PlayerId);
//        }
//    }
//}
