INSERT OR IGNORE INTO users (phone, name, region, town, rating, badges) VALUES
('+264812345678','Tomas K.',  'Zambezi',      'Rundu',      4.8, '["🌱 First Listing","🚀 Fast Seller"]'),
('+264813456789','Ndapewa S.','Otjozondjupa','Otjiwarongo',4.9, '["🏆 Top 5 Farmer"]'),
('+264814567890','Maria H.',  'Khomas',       'Windhoek',   4.7, '["💬 10 Answers"]');

INSERT INTO listings (title, category, description, quantity, unit, price, region, town, phone, badge, delivery, owner_id) VALUES
('50 Bags White Maize','Crops & Horticulture','Grade A, harvested last week.',50,'bags',350,'Zambezi','Rundu','+264812345678',NULL,'Pickup only',1),
('20 Head Beef Weaners','Livestock','Healthy weaners, ear-tagged.',20,'head of cattle',8500,'Otjozondjupa','Otjiwarongo','+264813456789','NamLITS Ear Tag','Pickup only',2),
('Organic Tomatoes','Crops & Horticulture','Fresh, pesticide-free.',200,'kg',45,'Khomas','Windhoek','+264814567890','Organic Certified','Delivery available (buyer pays)',3),
('Charcoal Bulk','Biomass / Charcoal','Premium hardwood charcoal.',50,'tons',2200,'Kavango East','Rundu','+264815678901',NULL,'Delivery available (buyer pays)',1),
('Tractor Rental','Machinery Rental','Per day incl. operator & fuel.',1,'units',1500,'Oshana','Oshakati','+264816789012',NULL,'Pickup only',2),
('Certified Maize Seed','Inputs & Seeds','10kg bags, drought tolerant.',100,'bags',620,'Omusati','Outapi','+264817890123','NAB Permit','Delivery available (buyer pays)',3);

INSERT INTO rfqs (item, region, budget, posted_by, owner_id) VALUES
('1,000 kg Class-1 Potatoes','Erongo',15000,'Walvis Bay Supermarket',1),
('200 Head Beef Weaners','Otjozondjupa',0,'Meatco',2);

INSERT INTO outbreak_alerts (disease, region, severity, farms_alerted) VALUES
('Maize Streak Virus','Kavango East','Critical',47),
('Fall Armyworm','Oshana','Moderate',29);

INSERT INTO talk_posts (user_name, text, owner_id) VALUES
('Kandjii','Armyworm spotted in Kavango East. Anyone else?',1),
('Dr. Shikongo','Apply neem extract early morning. Report to Agronomy Board.',2);