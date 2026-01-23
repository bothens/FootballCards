//using Domain_Layer.Entities;
//using Microsoft.EntityFrameworkCore;
//using Microsoft.EntityFrameworkCore.Metadata.Builders;

//namespace Infrastructure_Layer.Data.Configurations
//{
//    public sealed class PortfolioConfiguration : IEntityTypeConfiguration<Portfolio>
//    {
//        public void Configure(EntityTypeBuilder<Portfolio> builder)
//        {
//            builder.HasKey(x => x.Id);

//            builder.Property(x => x.UserId)
//                .IsRequired();

//            builder.Property(x => x.CreatedAt)
//                .IsRequired();

//            builder.HasIndex(x => x.UserId);
//        }
//    }
//}
