INSERT INTO `category` (`id`, `name`) VALUES (1, 'Wildlife');
INSERT INTO `category` (`id`, `name`) VALUES (2, 'Environmental Causes');
INSERT INTO `category` (`id`, `name`) VALUES (3, 'Animal Rights');
INSERT INTO `category` (`id`, `name`) VALUES (4, 'Health and Wellness');
INSERT INTO `category` (`id`, `name`) VALUES (5, 'Education');
INSERT INTO `category` (`id`, `name`) VALUES (6, 'Human Rights');
INSERT INTO `category` (`id`, `name`) VALUES (7, 'Technology and Innovation');
INSERT INTO `category` (`id`, `name`) VALUES (8, 'Arts and Culture');
INSERT INTO `category` (`id`, `name`) VALUES (9, 'Community Development');
INSERT INTO `category` (`id`, `name`) VALUES (10, 'Economic Empowerment');
INSERT INTO `category` (`id`, `name`) VALUES (11, 'Science and Research');
INSERT INTO `category` (`id`, `name`) VALUES (12, 'Sports and Recreation');

# Petition 1
INSERT INTO `petition` (`title`, `description`, `creation_date`, `image_filename`, `owner_id`, `category_id`) VALUES ('Mental Health Awareness in Schools', 'Help us promote and integrate mental health awareness programs into the NCEA curricula to support the well-being of students.', "2023-02-20 09:15:00", 'petition_1.png', 1, 5);

INSERT INTO `support_tier` (`petition_id`, `title`, `description`, `cost`) VALUES (1, 'Show your support', 'Supporting at the free tier helps promote our cause, thank you.', 0);
INSERT INTO `support_tier` (`petition_id`, `title`, `description`, `cost`) VALUES (1, 'Gold supporter', 'Supporting helps at this tier helps fund our operation so we can increase the number of schools we support directly.\n You will receive a personalized thank-you letter from us.', 25);
INSERT INTO `support_tier` (`petition_id`, `title`, `description`, `cost`) VALUES (1, 'Become part of the extended family', "Supporting at this tier helps fund our operation so we can increase the number of schools we support directly.\n Your name will be immortalised on the 'family' wall in our head office.", 150);

INSERT INTO `supporter` (`petition_id`, `support_tier_id`, `user_id`, `message`, `timestamp`) VALUES (1, 1, 2, 'Love the cause', '2023-03-20 12:15:18');
INSERT INTO `supporter` (`petition_id`, `support_tier_id`, `user_id`, `message`,  `timestamp`) VALUES (1, 1, 3, null, '2023-03-29 15:26:32');
INSERT INTO `supporter` (`petition_id`, `support_tier_id`, `user_id`, `message`, `timestamp`) VALUES (1, 2, 4, 'Keep up the great work!', '2023-04-05 10:05:47');

# Petition 2
INSERT INTO `petition` (`title`, `description`, `creation_date`, `image_filename`, `owner_id`, `category_id`) VALUES ('Christchurch Wildlife Conservation', 'Support conservation efforts to protect endangered species and their natural habitats within and around Otautahi Christchurch.', "2023-02-20 09:15:00", 'petition_2.png', 2, 2);

INSERT INTO `support_tier` (`petition_id`, `title`, `description`, `cost`) VALUES (2, 'Save a tree', 'With your donation we can save a native tree', 15);

INSERT INTO `supporter` (`petition_id`, `support_tier_id`, `user_id`, `message`, `timestamp`) VALUES (2, 4, 3, 'Hope my tree helps!', '2023-03-07 22:48:01');

# Petition 3
INSERT INTO `petition` (`title`, `description`, `creation_date`, `image_filename`, `owner_id`, `category_id`) VALUES ('Renewable Energy Newsletter', "Stay up to date with the most recent developments in New Zealand's advancements in renewable energy", "2023-10-18 10:10:00", 'petition_3.jpg', 3, 2);

INSERT INTO `support_tier` (`petition_id`, `title`, `description`, `cost`) VALUES (3, 'Join the newsletter', 'Sign-up to receive the monthly newsletter', 0);

INSERT INTO `supporter` (`petition_id`, `support_tier_id`, `user_id`, `message`, `timestamp`) VALUES (3, 5, 4, 'Interesting stuff', '2023-11-07 06:59:58');
INSERT INTO `supporter` (`petition_id`, `support_tier_id`, `user_id`, `message`, `timestamp`) VALUES (3, 5, 6, null, '2023-11-07 16:15:35');
INSERT INTO `supporter` (`petition_id`, `support_tier_id`, `user_id`, `message`, `timestamp`) VALUES (3, 5, 7, null, '2023-11-07 12:38:00');

# Petition 4
INSERT INTO `petition` (`title`, `description`, `creation_date`, `image_filename`, `owner_id`, `category_id`) VALUES ('Science Video Creation', "Hi all, I create online videos going into recent advancements in science. You can see my free videos on Youtube", "2023-08-01 09:00:00", 'petition_4.png', 8, 11);

INSERT INTO `support_tier` (`petition_id`, `title`, `description`, `cost`) VALUES (4, 'Tip me a coffee', 'A little tip helps me keep doing this as my day job, thanks!', 5);
INSERT INTO `support_tier` (`petition_id`, `title`, `description`, `cost`) VALUES (4, 'Join the club', 'Join the club of other like minded individuals, getting exclusive access to a monthly Zoom lecture and extra videos', 15);
INSERT INTO `support_tier` (`petition_id`, `title`, `description`, `cost`) VALUES (4, 'Mad Scientist', 'Get rewards from lower tiers and be part of an exclusive monthly zoom discussion where you can suggest and help with video ideas', 150);

INSERT INTO `supporter` (`petition_id`, `support_tier_id`, `user_id`, `message`, `timestamp`) VALUES (4, 6, 1, null, '2023-09-07 20:22:45');
INSERT INTO `supporter` (`petition_id`, `support_tier_id`, `user_id`, `message`, `timestamp`) VALUES (4, 6, 3, null, '2023-10-01 17:15:32');
INSERT INTO `supporter` (`petition_id`, `support_tier_id`, `user_id`, `message`, `timestamp`) VALUES (4, 6, 4, null, '2023-12-18 11:37:58');
INSERT INTO `supporter` (`petition_id`, `support_tier_id`, `user_id`, `message`, `timestamp`) VALUES (4, 7, 4, "Love your content, looking forward to those lectures <3", '2023-12-18 11:38:26');

# Petition 5
INSERT INTO `petition` (`title`, `description`, `creation_date`, `image_filename`, `owner_id`, `category_id`) VALUES ('Evergreen-High Baseball Team Fundraiser', "Help us fundraise to play baseball on the international stage at the 2024 High-School Champs Tournament in Japan", "2024-01-11 08:33:00", 'petition_5.png', 9, 12);

INSERT INTO `support_tier` (`petition_id`, `title`, `description`, `cost`) VALUES (5, 'Bronze Supporter', 'Every little bit helps!', 5);
INSERT INTO `support_tier` (`petition_id`, `title`, `description`, `cost`) VALUES (5, 'Silver Supporter', 'Every little bit helps!', 10);
INSERT INTO `support_tier` (`petition_id`, `title`, `description`, `cost`) VALUES (5, 'Gold Supporter', 'Every little bit helps!', 20);

INSERT INTO `supporter` (`petition_id`, `support_tier_id`, `user_id`, `message`, `timestamp`) VALUES (5, 11, 1, "GO EVERGREEN!!", '2024-01-12 21:18:59');

# Petition 6
INSERT INTO `petition` (`title`, `description`, `creation_date`, `image_filename`, `owner_id`, `category_id`) VALUES ('Avonbush Natural Park', "Come and experience the great outdoors at Avonbush Natural Park", "2022-12-11 11:56:12", 'petition_6.png', 3, 1);

INSERT INTO `support_tier` (`petition_id`, `title`, `description`, `cost`) VALUES (6, 'Join the newsletter', 'Sign-up to receive the monthly newsletter', 0);
INSERT INTO `support_tier` (`petition_id`, `title`, `description`, `cost`) VALUES (6, 'Support the park', "Help fund the operation of the park into the future, you'll get your name included on a plaque by the entrance", 100);

INSERT INTO `supporter` (`petition_id`, `support_tier_id`, `user_id`, `message`, `timestamp`) VALUES (6, 13, 2, "Great wee park to take the family for a walk", '2023-01-20 16:00:16');

# Petition 7 (Generated by ChatGPT)
INSERT INTO `petition` (`title`, `description`, `creation_date`, `image_filename`, `owner_id`, `category_id`) VALUES ('Community Garden Expansion', 'Help us expand our community garden to provide more fresh produce for local residents and food banks.', "2023-05-15 14:30:00", 'petition_7.png', 5, 9);

INSERT INTO `support_tier` (`petition_id`, `title`, `description`, `cost`) VALUES (7, 'Seed Sower', 'Contribute to our garden by sponsoring a packet of seeds.', 5);
INSERT INTO `support_tier` (`petition_id`, `title`, `description`, `cost`) VALUES (7, 'Garden Guardian', 'Become a Garden Guardian and receive a personalized thank-you card and a small basket of fresh produce.', 20);
INSERT INTO `support_tier` (`petition_id`, `title`, `description`, `cost`) VALUES (7, 'Harvest Hero', 'Be a Harvest Hero and receive a VIP tour of our expanded garden plus a large basket of fresh produce.', 50);

INSERT INTO `supporter` (`petition_id`, `support_tier_id`, `user_id`, `message`, `timestamp`) VALUES (7, 14, 6, 'Excited to see the garden grow!', '2023-06-01 11:45:22');
INSERT INTO `supporter` (`petition_id`, `support_tier_id`, `user_id`, `message`, `timestamp`) VALUES (7, 15, 7, null, '2023-06-10 08:30:15');
INSERT INTO `supporter` (`petition_id`, `support_tier_id`, `user_id`, `message`, `timestamp`) VALUES (7, 16, 8, 'Looking forward to the VIP tour!', '2023-06-25 14:12:30');

# Petition 8 (Generated by ChatGPT)
INSERT INTO `petition` (`title`, `description`, `creation_date`, `image_filename`, `owner_id`, `category_id`) VALUES ('Youth Coding Bootcamp', 'Fund a coding bootcamp for local youth to learn valuable programming skills.', "2023-07-02 10:00:00", 'petition_8.png', 10, 7);

INSERT INTO `support_tier` (`petition_id`, `title`, `description`, `cost`) VALUES (8, 'Coding Enthusiast', 'Support one student to attend the bootcamp.', 50);
INSERT INTO `support_tier` (`petition_id`, `title`, `description`, `cost`) VALUES (8, 'Tech Advocate', 'Sponsor two students to attend the bootcamp.', 100);
INSERT INTO `support_tier` (`petition_id`, `title`, `description`, `cost`) VALUES (8, 'Future Developer', 'Sponsor three students to attend the bootcamp and receive a thank-you video from the students.', 150);

INSERT INTO `supporter` (`petition_id`, `support_tier_id`, `user_id`, `message`, `timestamp`) VALUES (8, 17, 11, 'Happy to support education in technology!', '2023-07-15 09:30:45');
INSERT INTO `supporter` (`petition_id`, `support_tier_id`, `user_id`, `message`, `timestamp`) VALUES (8, 18, 12, null, '2023-07-22 14:20:10');
INSERT INTO `supporter` (`petition_id`, `support_tier_id`, `user_id`, `message`, `timestamp`) VALUES (8, 19, 13, 'Excited to see the next generation of developers!', '2023-08-05 11:05:22');

# Petition 9 (Generated by ChatGPT)
INSERT INTO `petition` (`title`, `description`, `creation_date`, `image_filename`, `owner_id`, `category_id`) VALUES ('Community Book Exchange', 'Create a community book exchange to promote literacy and share the love of reading.', "2023-08-15 16:45:00", 'petition_9.png', 14, 8);

INSERT INTO `support_tier` (`petition_id`, `title`, `description`, `cost`) VALUES (9, 'Book Lover', 'Contribute to the book exchange and receive a personalized bookmark.', 10);
INSERT INTO `support_tier` (`petition_id`, `title`, `description`, `cost`) VALUES (9, 'Library Guardian', 'Sponsor a bookshelf for the exchange and have your name displayed as a Library Guardian.', 25);

INSERT INTO `supporter` (`petition_id`, `support_tier_id`, `user_id`, `message`, `timestamp`) VALUES (9, 20, 15, 'Excited to see the community come together!', '2023-09-01 13:20:45');
INSERT INTO `supporter` (`petition_id`, `support_tier_id`, `user_id`, `message`, `timestamp`) VALUES (9, 21, 16, 'Happy to support literacy initiatives!', '2023-09-05 10:15:30');
INSERT INTO `supporter` (`petition_id`, `support_tier_id`, `user_id`, `message`, `timestamp`) VALUES (9, 21, 17, null, '2023-09-10 16:40:12');

# Petition 10 (Generated by ChatGPT)
INSERT INTO `petition` (`title`, `description`, `creation_date`, `image_filename`, `owner_id`, `category_id`) VALUES ('Local Art Exhibition', 'Support a local art exhibition showcasing the talent of emerging artists in our community.', "2023-10-01 14:00:00", 'petition_10.png', 12, 8);

INSERT INTO `support_tier` (`petition_id`, `title`, `description`, `cost`) VALUES (10, 'Art Enthusiast', 'Contribute to the exhibition and receive a digital art print from one of the featured artists.', 20);
INSERT INTO `support_tier` (`petition_id`, `title`, `description`, `cost`) VALUES (10, 'Patron of the Arts', 'Become a Patron of the Arts and receive VIP access to the exhibition opening night.', 50);

INSERT INTO `supporter` (`petition_id`, `support_tier_id`, `user_id`, `message`, `timestamp`) VALUES (10, 22, 18, 'Excited to see the local talent!', '2023-10-10 09:45:22');
INSERT INTO `supporter` (`petition_id`, `support_tier_id`, `user_id`, `message`, `timestamp`) VALUES (10, 22, 1, null, '2023-10-12 15:20:35');
INSERT INTO `supporter` (`petition_id`, `support_tier_id`, `user_id`, `message`, `timestamp`) VALUES (10, 23, 2, null, '2023-10-18 12:00:00');
INSERT INTO `supporter` (`petition_id`, `support_tier_id`, `user_id`, `message`, `timestamp`) VALUES (10, 23, 3, 'Looking forward to the VIP night!', '2023-10-25 18:30:45');

# Petition 11 (Generated by ChatGPT)
INSERT INTO `petition` (`title`, `description`, `creation_date`, `image_filename`, `owner_id`, `category_id`) VALUES ('Clean Water Initiative', 'Support efforts to provide clean and safe drinking water to rural communities in need.', "2023-11-05 11:30:00", 'petition_11.png', 13, 2);

INSERT INTO `support_tier` (`petition_id`, `title`, `description`, `cost`) VALUES (11, 'Droplet Donor', 'Contribute to the clean water initiative and receive a personalized thank-you card.', 15);

INSERT INTO `supporter` (`petition_id`, `support_tier_id`, `user_id`, `message`, `timestamp`) VALUES (11, 24, 4, 'Clean water for all!', '2023-11-10 08:15:22');
INSERT INTO `supporter` (`petition_id`, `support_tier_id`, `user_id`, `message`, `timestamp`) VALUES (11, 24, 5, 'Happy to make a difference!', '2023-11-12 14:30:40');
INSERT INTO `supporter` (`petition_id`, `support_tier_id`, `user_id`, `message`, `timestamp`) VALUES (11, 24, 6, null, '2023-11-18 10:00:00');

# Petition 12 (Generated by ChatGPT)
INSERT INTO `petition` (`title`, `description`, `creation_date`, `image_filename`, `owner_id`, `category_id`) VALUES ('Local Music Festival', 'Support a local music festival featuring talented musicians from our community.', "2023-12-01 17:00:00", 'petition_12.png', 16, 8);

INSERT INTO `support_tier` (`petition_id`, `title`, `description`, `cost`) VALUES (12, 'Music Fan', 'Contribute to the festival and receive a digital playlist of songs from the featured artists.', 10);
INSERT INTO `support_tier` (`petition_id`, `title`, `description`, `cost`) VALUES (12, 'Backstage Pass', 'Get a Backstage Pass and enjoy VIP access during the festival, including meet and greet opportunities.', 30);

INSERT INTO `supporter` (`petition_id`, `support_tier_id`, `user_id`, `message`, `timestamp`) VALUES (12, 25, 7, 'Excited for the music festival!', '2023-12-05 12:45:22');
INSERT INTO `supporter` (`petition_id`, `support_tier_id`, `user_id`, `message`, `timestamp`) VALUES (12, 25, 8, null, '2023-12-08 09:30:15');
INSERT INTO `supporter` (`petition_id`, `support_tier_id`, `user_id`, `message`, `timestamp`) VALUES (12, 26, 9, 'Looking forward to the backstage experience!', '2023-12-15 14:12:30');

# Petition 13 (Generated by ChatGPT)
INSERT INTO `petition` (`title`, `description`, `creation_date`, `image_filename`, `owner_id`, `category_id`) VALUES ('Green Energy Community Project', 'Support the development of green energy initiatives in our community to reduce carbon emissions.', "2024-01-15 10:30:00", 'petition_13.png', 15, 3);

INSERT INTO `support_tier` (`petition_id`, `title`, `description`, `cost`) VALUES (13, 'Eco Warrior', 'Contribute to the green energy project and receive a reusable eco-friendly shopping bag.', 20);
INSERT INTO `support_tier` (`petition_id`, `title`, `description`, `cost`) VALUES (13, 'Renewable Advocate', 'Sponsor a solar panel installation and receive a personalized certificate of appreciation.', 50);

INSERT INTO `supporter` (`petition_id`, `support_tier_id`, `user_id`, `message`, `timestamp`) VALUES (13, 27, 10, "Let\'s go green!", '2024-01-20 11:15:22');
INSERT INTO `supporter` (`petition_id`, `support_tier_id`, `user_id`, `message`, `timestamp`) VALUES (13, 27, 11, null, '2024-01-25 14:30:40');

# Petition 14 (Generated by ChatGPT)
INSERT INTO `petition` (`title`, `description`, `creation_date`, `image_filename`, `owner_id`, `category_id`) VALUES ('Youth Leadership Development Program', 'Empower the youth in our community by supporting a leadership development program.', "2024-02-01 14:00:00", 'petition_14.png', 17, 6);

INSERT INTO `support_tier` (`petition_id`, `title`, `description`, `cost`) VALUES (14, 'Leadership Advocate', 'Contribute to the program and receive a thank-you letter from the youth participants.', 30);
INSERT INTO `support_tier` (`petition_id`, `title`, `description`, `cost`) VALUES (14, 'Mentorship Champion', 'Sponsor a mentorship session for a young leader and receive recognition in program materials.', 75);
INSERT INTO `support_tier` (`petition_id`, `title`, `description`, `cost`) VALUES (14, 'Youth Ambassador', 'Become a Youth Ambassador and have the opportunity to attend a special recognition event with the young leaders.', 150);

INSERT INTO `supporter` (`petition_id`, `support_tier_id`, `user_id`, `message`, `timestamp`) VALUES (14, 29, 12, 'Excited to support youth leadership!', '2024-02-05 09:45:22');
INSERT INTO `supporter` (`petition_id`, `support_tier_id`, `user_id`, `message`, `timestamp`) VALUES (14, 30, 13, null, '2024-02-10 08:30:15');
INSERT INTO `supporter` (`petition_id`, `support_tier_id`, `user_id`, `message`, `timestamp`) VALUES (14, 31, 14, 'Looking forward to the recognition event!', '2024-02-15 14:12:30');

# Petition 15 (Generated by ChatGPT)
INSERT INTO `petition` (`title`, `description`, `creation_date`, `image_filename`, `owner_id`, `category_id`) VALUES ('Community Clean-Up Day', 'Join us in making our community clean and beautiful by participating in the upcoming clean-up day.', "2024-03-01 09:00:00", 'petition_15.png', 14, 9);

INSERT INTO `support_tier` (`petition_id`, `title`, `description`, `cost`) VALUES (15, 'Community Hero', 'Sign up for free and be recognized as a Community Hero for participating in the clean-up day.', 0);

INSERT INTO `supporter` (`petition_id`, `support_tier_id`, `user_id`, `message`, `timestamp`) VALUES (15, 32, 15, 'Excited to contribute to a cleaner community!', '2024-03-05 11:15:22');
INSERT INTO `supporter` (`petition_id`, `support_tier_id`, `user_id`, `message`, `timestamp`) VALUES (15, 32, 16, null, '2024-03-08 14:30:40');

# Petition 16 (Generated by ChatGPT)
INSERT INTO `petition` (`title`, `description`, `creation_date`, `image_filename`, `owner_id`, `category_id`) VALUES ('Local History Preservation', 'Support the preservation of our local history by contributing to the digitization of historical documents and artifacts.', "2024-03-10 10:30:00", 'petition_16.png', 16, 8);

INSERT INTO `support_tier` (`petition_id`, `title`, `description`, `cost`) VALUES (16, 'History Enthusiast', 'Support for free and gain access to a digital archive of historical photos and documents.', 0);

INSERT INTO `supporter` (`petition_id`, `support_tier_id`, `user_id`, `message`, `timestamp`) VALUES (16, 33, 17, 'Passionate about preserving our history!', '2024-03-15 09:45:22');
INSERT INTO `supporter` (`petition_id`, `support_tier_id`, `user_id`, `message`, `timestamp`) VALUES (16, 33, 18, null, '2024-03-18 08:30:15');

# Petition 17 (Generated by ChatGPT)
INSERT INTO `petition` (`title`, `description`, `creation_date`, `image_filename`, `owner_id`, `category_id`) VALUES ('Local Community Sports Equipment Drive', 'Help us gather sports equipment for local community sports programs to ensure all kids have the opportunity to play.', "2024-04-01 14:00:00", 'petition_17.png', 18, 12);

INSERT INTO `support_tier` (`petition_id`, `title`, `description`, `cost`) VALUES (17, 'Equipment Supporter', 'Show your support and receive a free personalized thank-you e-card.', 0);
INSERT INTO `support_tier` (`petition_id`, `title`, `description`, `cost`) VALUES (17, 'Gear Champion', 'Sponsor a set of sports gear for a child and receive a thank-you package with photos and updates.', 20);

INSERT INTO `supporter` (`petition_id`, `support_tier_id`, `user_id`, `message`, `timestamp`) VALUES (17, 34, 1, 'Excited to support youth sports!', '2024-04-05 12:45:22');
INSERT INTO `supporter` (`petition_id`, `support_tier_id`, `user_id`, `message`, `timestamp`) VALUES (17, 35, 2, null, '2024-04-08 09:30:15');
INSERT INTO `supporter` (`petition_id`, `support_tier_id`, `user_id`, `message`, `timestamp`) VALUES (17, 35, 3, 'Happy to make a difference!', '2024-04-12 14:30:40');

# Petition 18 (Generated by ChatGPT)
INSERT INTO `petition` (`title`, `description`, `creation_date`, `image_filename`, `owner_id`, `category_id`) VALUES ('Community Health and Wellness Workshop', 'Support a health and wellness workshop for the community to learn about fitness, nutrition, and mental health.', "2024-05-01 09:30:00", 'petition_18.png', 11, 4);

INSERT INTO `support_tier` (`petition_id`, `title`, `description`, `cost`) VALUES (18, 'Wellness Enthusiast', 'Support the workshop and gain free access to materials and resources.', 0);
INSERT INTO `support_tier` (`petition_id`, `title`, `description`, `cost`) VALUES (18, 'Healthy Living Supporter', 'Sponsor a workshop session and receive a personalized health and fitness plan from our experts.', 30);

INSERT INTO `supporter` (`petition_id`, `support_tier_id`, `user_id`, `message`, `timestamp`) VALUES (18, 36, 4, 'Excited for the wellness workshop!', '2024-05-05 11:15:22');
INSERT INTO `supporter` (`petition_id`, `support_tier_id`, `user_id`, `message`, `timestamp`) VALUES (18, 37, 5, null, '2024-05-08 14:30:40');