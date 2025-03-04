﻿// <auto-generated />
using System;
using EntityFramework.Sqlite;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

#nullable disable

namespace EntityFramework.Sqlite.Migrations
{
    [DbContext(typeof(SqliteDbContext))]
    partial class SqliteDbContextModelSnapshot : ModelSnapshot
    {
        protected override void BuildModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder.HasAnnotation("ProductVersion", "9.0.2");

            modelBuilder.Entity("Z1.Core.Entities.ChatMessage", b =>
                {
                    b.Property<long>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("INTEGER");

                    b.Property<long?>("ChannelId")
                        .HasColumnType("INTEGER");

                    b.Property<int>("CompleteTokens")
                        .HasColumnType("INTEGER");

                    b.Property<string>("Content")
                        .IsRequired()
                        .HasMaxLength(-1)
                        .HasColumnType("TEXT");

                    b.Property<DateTime>("CreatedAt")
                        .HasColumnType("TEXT");

                    b.Property<string>("CreatedBy")
                        .HasMaxLength(50)
                        .HasColumnType("TEXT");

                    b.Property<string>("Files")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.Property<string>("ModelId")
                        .HasColumnType("TEXT");

                    b.Property<int>("PromptTokens")
                        .HasColumnType("INTEGER");

                    b.Property<int>("ResponseTime")
                        .HasColumnType("INTEGER");

                    b.Property<string>("Role")
                        .IsRequired()
                        .HasMaxLength(255)
                        .HasColumnType("TEXT");

                    b.Property<long?>("SessionId")
                        .HasColumnType("INTEGER");

                    b.Property<long?>("ShareId")
                        .HasColumnType("INTEGER");

                    b.HasKey("Id");

                    b.HasIndex("ChannelId");

                    b.HasIndex("CreatedBy");

                    b.HasIndex("ModelId");

                    b.HasIndex("SessionId");

                    b.HasIndex("ShareId");

                    b.ToTable("ChatMessages");
                });

            modelBuilder.Entity("Z1.Core.Entities.FileStorage", b =>
                {
                    b.Property<string>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("TEXT");

                    b.Property<string>("ContentType")
                        .IsRequired()
                        .HasMaxLength(255)
                        .HasColumnType("TEXT");

                    b.Property<DateTime>("CreatedAt")
                        .HasColumnType("TEXT");

                    b.Property<string>("CreatedBy")
                        .HasMaxLength(50)
                        .HasColumnType("TEXT");

                    b.Property<string>("FileName")
                        .IsRequired()
                        .HasMaxLength(255)
                        .HasColumnType("TEXT");

                    b.Property<string>("ProviderId")
                        .HasColumnType("TEXT");

                    b.Property<int>("Size")
                        .HasColumnType("INTEGER");

                    b.HasKey("Id");

                    b.HasIndex("CreatedBy");

                    b.HasIndex("ProviderId");

                    b.ToTable("FileStorages");
                });

            modelBuilder.Entity("Z1.Core.Entities.Message", b =>
                {
                    b.Property<long>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("INTEGER");

                    b.Property<DateTime>("CreatedAt")
                        .HasColumnType("TEXT");

                    b.Property<string>("CreatedBy")
                        .HasMaxLength(50)
                        .HasColumnType("TEXT");

                    b.Property<string>("Error")
                        .HasColumnType("TEXT");

                    b.Property<long?>("ParentId")
                        .HasColumnType("INTEGER");

                    b.Property<string>("Role")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.Property<long?>("SessionId")
                        .HasColumnType("INTEGER");

                    b.Property<long?>("ShareId")
                        .HasColumnType("INTEGER");

                    b.HasKey("Id");

                    b.HasIndex("CreatedBy");

                    b.HasIndex("SessionId");

                    b.HasIndex("ShareId");

                    b.ToTable("Messages");
                });

            modelBuilder.Entity("Z1.Core.Entities.MessageFile", b =>
                {
                    b.Property<long>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("INTEGER");

                    b.Property<DateTime>("CreatedAt")
                        .HasColumnType("TEXT");

                    b.Property<string>("CreatedBy")
                        .HasMaxLength(50)
                        .HasColumnType("TEXT");

                    b.Property<string>("FileId")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.Property<string>("FileName")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.Property<long>("FileSize")
                        .HasColumnType("INTEGER");

                    b.Property<string>("FileStorageId")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.Property<string>("FileUrl")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.Property<long>("MessageId")
                        .HasColumnType("INTEGER");

                    b.HasKey("Id");

                    b.HasIndex("CreatedBy");

                    b.HasIndex("FileId");

                    b.HasIndex("FileStorageId");

                    b.HasIndex("MessageId");

                    b.ToTable("MessageFiles");
                });

            modelBuilder.Entity("Z1.Core.Entities.MessageModelUsage", b =>
                {
                    b.Property<long>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("INTEGER");

                    b.Property<int>("CompleteTokens")
                        .HasColumnType("INTEGER");

                    b.Property<DateTime>("CreatedAt")
                        .HasColumnType("TEXT");

                    b.Property<string>("CreatedBy")
                        .HasMaxLength(50)
                        .HasColumnType("TEXT");

                    b.Property<long?>("MessageId")
                        .HasColumnType("INTEGER");

                    b.Property<int>("PromptTokens")
                        .HasColumnType("INTEGER");

                    b.Property<int>("ResponseTime")
                        .HasColumnType("INTEGER");

                    b.Property<long?>("SessionId")
                        .HasColumnType("INTEGER");

                    b.HasKey("Id");

                    b.HasIndex("CreatedBy");

                    b.HasIndex("MessageId")
                        .IsUnique();

                    b.ToTable("MessageModelUsages");
                });

            modelBuilder.Entity("Z1.Core.Entities.MessageText", b =>
                {
                    b.Property<long>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("INTEGER");

                    b.Property<DateTime>("CreatedAt")
                        .HasColumnType("TEXT");

                    b.Property<string>("CreatedBy")
                        .HasMaxLength(50)
                        .HasColumnType("TEXT");

                    b.Property<string>("ExtraData")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.Property<long>("MessageId")
                        .HasColumnType("INTEGER");

                    b.Property<string>("ReasoningUpdate")
                        .HasColumnType("TEXT");

                    b.Property<string>("SearchResults")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.Property<string>("Text")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.HasKey("Id");

                    b.HasIndex("CreatedBy");

                    b.HasIndex("MessageId");

                    b.ToTable("MessageTexts");
                });

            modelBuilder.Entity("Z1.Core.Entities.Model", b =>
                {
                    b.Property<string>("Id")
                        .HasColumnType("TEXT");

                    b.Property<string>("Abilities")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.Property<int?>("ContextWindowTokens")
                        .HasColumnType("INTEGER");

                    b.Property<DateTime>("CreatedAt")
                        .HasColumnType("TEXT");

                    b.Property<string>("CreatedBy")
                        .HasMaxLength(50)
                        .HasColumnType("TEXT");

                    b.Property<string>("Description")
                        .HasMaxLength(500)
                        .HasColumnType("TEXT");

                    b.Property<string>("DisplayName")
                        .IsRequired()
                        .HasMaxLength(100)
                        .HasColumnType("TEXT");

                    b.Property<bool?>("Enabled")
                        .HasColumnType("INTEGER");

                    b.Property<int?>("MaxOutput")
                        .HasColumnType("INTEGER");

                    b.Property<string>("ModelId")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.Property<string>("Pricing")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.Property<string>("Provider")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.Property<string>("ReleasedAt")
                        .HasColumnType("TEXT");

                    b.Property<string>("Resolutions")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.Property<string>("Type")
                        .IsRequired()
                        .HasMaxLength(50)
                        .HasColumnType("TEXT");

                    b.HasKey("Id");

                    b.HasIndex("CreatedBy");

                    b.HasIndex("DisplayName");

                    b.HasIndex("Provider");

                    b.ToTable("Models");
                });

            modelBuilder.Entity("Z1.Core.Entities.ModelChannel", b =>
                {
                    b.Property<long>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("INTEGER");

                    b.Property<bool>("Available")
                        .HasColumnType("INTEGER");

                    b.Property<string>("Avatar")
                        .HasColumnType("TEXT");

                    b.Property<DateTime>("CreatedAt")
                        .HasColumnType("TEXT");

                    b.Property<string>("CreatedBy")
                        .HasMaxLength(50)
                        .HasColumnType("TEXT");

                    b.Property<string>("Description")
                        .HasColumnType("TEXT");

                    b.Property<bool>("Enabled")
                        .HasColumnType("INTEGER");

                    b.Property<string>("Endpoint")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.Property<bool>("Favorite")
                        .HasColumnType("INTEGER");

                    b.Property<string>("Keys")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.Property<string>("ModelIds")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.Property<string>("Provider")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.Property<long?>("RequestCount")
                        .HasColumnType("INTEGER");

                    b.Property<long?>("ResponseTime")
                        .HasColumnType("INTEGER");

                    b.Property<string>("Tags")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.Property<long?>("TokenCost")
                        .HasColumnType("INTEGER");

                    b.HasKey("Id");

                    b.HasIndex("CreatedBy");

                    b.HasIndex("Name");

                    b.HasIndex("Provider");

                    b.ToTable("ModelChannels");
                });

            modelBuilder.Entity("Z1.Core.Entities.ModelChannelInviteCode", b =>
                {
                    b.Property<long>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("INTEGER");

                    b.Property<long>("ChannelId")
                        .HasColumnType("INTEGER");

                    b.Property<string>("Code")
                        .IsRequired()
                        .HasMaxLength(32)
                        .HasColumnType("TEXT");

                    b.Property<DateTime>("CreatedAt")
                        .HasColumnType("TEXT");

                    b.Property<string>("CreatedBy")
                        .HasMaxLength(50)
                        .HasColumnType("TEXT");

                    b.Property<bool>("Enabled")
                        .HasColumnType("INTEGER");

                    b.Property<DateTime?>("ExpireTime")
                        .HasColumnType("TEXT");

                    b.Property<string>("Inviter")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.Property<bool>("IsUsed")
                        .HasColumnType("INTEGER");

                    b.Property<int>("MaxUseCount")
                        .HasColumnType("INTEGER");

                    b.Property<int>("Quota")
                        .HasColumnType("INTEGER");

                    b.Property<int>("UsedCount")
                        .HasColumnType("INTEGER");

                    b.Property<string>("UsedUsers")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.HasKey("Id");

                    b.HasIndex("CreatedBy");

                    b.HasIndex("ChannelId", "Code", "Inviter");

                    b.ToTable("ModelChannelInviteCodes");
                });

            modelBuilder.Entity("Z1.Core.Entities.ModelChannelShareUser", b =>
                {
                    b.Property<long>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("INTEGER");

                    b.Property<long>("ChannelId")
                        .HasColumnType("INTEGER");

                    b.Property<DateTime>("CreatedAt")
                        .HasColumnType("TEXT");

                    b.Property<string>("CreatedBy")
                        .HasMaxLength(50)
                        .HasColumnType("TEXT");

                    b.Property<bool>("Enabled")
                        .HasColumnType("INTEGER");

                    b.Property<DateTime>("LastUsedAt")
                        .HasColumnType("TEXT");

                    b.Property<long?>("ModelChannelId")
                        .HasColumnType("INTEGER");

                    b.Property<int>("Quota")
                        .HasColumnType("INTEGER");

                    b.Property<long?>("RequestCount")
                        .HasColumnType("INTEGER");

                    b.Property<long>("TokenCount")
                        .HasColumnType("INTEGER");

                    b.Property<string>("UserId")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.HasKey("Id");

                    b.HasIndex("ChannelId");

                    b.HasIndex("CreatedBy");

                    b.HasIndex("ModelChannelId");

                    b.HasIndex("UserId");

                    b.HasIndex("ChannelId", "UserId")
                        .IsUnique();

                    b.ToTable("ModelChannelShareUsers");
                });

            modelBuilder.Entity("Z1.Core.Entities.Session", b =>
                {
                    b.Property<long>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("INTEGER");

                    b.Property<string>("Avatar")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.Property<DateTime>("CreatedAt")
                        .HasColumnType("TEXT");

                    b.Property<string>("CreatedBy")
                        .HasMaxLength(50)
                        .HasColumnType("TEXT");

                    b.Property<string>("Description")
                        .HasColumnType("TEXT");

                    b.Property<bool>("Favorite")
                        .HasColumnType("INTEGER");

                    b.Property<int?>("FrequencyPenalty")
                        .HasColumnType("INTEGER");

                    b.Property<int>("HistoryMessagesCount")
                        .HasColumnType("INTEGER");

                    b.Property<int?>("MaxTokens")
                        .HasColumnType("INTEGER");

                    b.Property<string>("Model")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.Property<int?>("PresencePenalty")
                        .HasColumnType("INTEGER");

                    b.Property<string>("RenameModel")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.Property<string>("SessionGroupId")
                        .HasColumnType("TEXT");

                    b.Property<string>("System")
                        .HasMaxLength(-1)
                        .HasColumnType("TEXT");

                    b.Property<string>("Tags")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.Property<double?>("Temperature")
                        .HasColumnType("REAL");

                    b.Property<int?>("TopP")
                        .HasColumnType("INTEGER");

                    b.HasKey("Id");

                    b.HasIndex("CreatedBy");

                    b.HasIndex("Name");

                    b.HasIndex("SessionGroupId");

                    b.ToTable("Sessions");
                });

            modelBuilder.Entity("Z1.Core.Entities.SessionGroup", b =>
                {
                    b.Property<string>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("TEXT");

                    b.Property<DateTime>("CreatedAt")
                        .HasColumnType("TEXT");

                    b.Property<string>("CreatedBy")
                        .HasMaxLength(50)
                        .HasColumnType("TEXT");

                    b.Property<string>("Description")
                        .HasColumnType("TEXT");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasMaxLength(50)
                        .HasColumnType("TEXT");

                    b.HasKey("Id");

                    b.HasIndex("CreatedBy");

                    b.HasIndex("Name");

                    b.ToTable("SessionGroups");
                });

            modelBuilder.Entity("Z1.Core.Entities.User", b =>
                {
                    b.Property<string>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("TEXT");

                    b.Property<string>("Avatar")
                        .HasMaxLength(1000)
                        .HasColumnType("TEXT");

                    b.Property<DateTime>("CreatedAt")
                        .HasColumnType("TEXT");

                    b.Property<string>("CreatedBy")
                        .HasMaxLength(50)
                        .HasColumnType("TEXT");

                    b.Property<string>("DisplayName")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.Property<string>("Email")
                        .HasMaxLength(50)
                        .IsUnicode(true)
                        .HasColumnType("TEXT");

                    b.Property<bool>("Enabled")
                        .HasColumnType("INTEGER");

                    b.Property<string>("PasswordHash")
                        .HasColumnType("TEXT");

                    b.Property<string>("Phone")
                        .HasMaxLength(20)
                        .IsUnicode(false)
                        .HasColumnType("TEXT");

                    b.Property<string>("Role")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.Property<string>("UserName")
                        .IsRequired()
                        .HasMaxLength(50)
                        .IsUnicode(true)
                        .HasColumnType("TEXT");

                    b.HasKey("Id");

                    b.HasIndex("CreatedBy");

                    b.HasIndex("Email");

                    b.HasIndex("Phone");

                    b.HasIndex("UserName");

                    b.ToTable("Users");
                });

            modelBuilder.Entity("Z1.Core.Entities.UserOAuth", b =>
                {
                    b.Property<string>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("TEXT");

                    b.Property<DateTime>("CreatedAt")
                        .HasColumnType("TEXT");

                    b.Property<string>("CreatedBy")
                        .HasMaxLength(50)
                        .HasColumnType("TEXT");

                    b.Property<string>("Provider")
                        .IsRequired()
                        .HasMaxLength(50)
                        .HasColumnType("TEXT");

                    b.Property<string>("ProviderUserId")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.Property<string>("UserId")
                        .IsRequired()
                        .HasMaxLength(36)
                        .HasColumnType("TEXT");

                    b.HasKey("Id");

                    b.HasIndex("CreatedBy");

                    b.HasIndex("Provider", "ProviderUserId", "UserId")
                        .IsUnique();

                    b.ToTable("UserOAuths");
                });

            modelBuilder.Entity("Z1.Core.Entities.MessageFile", b =>
                {
                    b.HasOne("Z1.Core.Entities.FileStorage", "FileStorage")
                        .WithMany()
                        .HasForeignKey("FileStorageId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("Z1.Core.Entities.Message", "Message")
                        .WithMany("Files")
                        .HasForeignKey("MessageId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("FileStorage");

                    b.Navigation("Message");
                });

            modelBuilder.Entity("Z1.Core.Entities.MessageModelUsage", b =>
                {
                    b.HasOne("Z1.Core.Entities.Message", null)
                        .WithOne("ModelUsages")
                        .HasForeignKey("Z1.Core.Entities.MessageModelUsage", "MessageId");
                });

            modelBuilder.Entity("Z1.Core.Entities.MessageText", b =>
                {
                    b.HasOne("Z1.Core.Entities.Message", "Message")
                        .WithMany("Texts")
                        .HasForeignKey("MessageId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Message");
                });

            modelBuilder.Entity("Z1.Core.Entities.ModelChannelInviteCode", b =>
                {
                    b.HasOne("Z1.Core.Entities.ModelChannel", "Channel")
                        .WithMany()
                        .HasForeignKey("ChannelId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Channel");
                });

            modelBuilder.Entity("Z1.Core.Entities.ModelChannelShareUser", b =>
                {
                    b.HasOne("Z1.Core.Entities.ModelChannel", "Channel")
                        .WithMany()
                        .HasForeignKey("ChannelId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("Z1.Core.Entities.ModelChannel", null)
                        .WithMany("ShareUsers")
                        .HasForeignKey("ModelChannelId");

                    b.HasOne("Z1.Core.Entities.User", "User")
                        .WithMany()
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Channel");

                    b.Navigation("User");
                });

            modelBuilder.Entity("Z1.Core.Entities.Session", b =>
                {
                    b.HasOne("Z1.Core.Entities.SessionGroup", "SessionGroup")
                        .WithMany()
                        .HasForeignKey("SessionGroupId");

                    b.Navigation("SessionGroup");
                });

            modelBuilder.Entity("Z1.Core.Entities.Message", b =>
                {
                    b.Navigation("Files");

                    b.Navigation("ModelUsages");

                    b.Navigation("Texts");
                });

            modelBuilder.Entity("Z1.Core.Entities.ModelChannel", b =>
                {
                    b.Navigation("ShareUsers");
                });
#pragma warning restore 612, 618
        }
    }
}
