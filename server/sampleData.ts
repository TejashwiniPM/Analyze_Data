// Sample realistic datasets for Analytics with Data platform

export interface SampleDatasetDefinition {
  name: string;
  filename: string;
  description: string;
  category: string;
  csvContent: string;
}

export const SAMPLE_SALES_CSV: string = `order_id,order_date,customer_id,product,category,region,quantity,unit_price,revenue,cost,profit
ORD-1001,2024-01-05,CUST-201,MacBook Pro 16,Electronics,North,2,2499,4998,3800,1198
ORD-1002,2024-01-07,CUST-202,Ergonomic Chair,Furniture,West,5,350,1750,1100,650
ORD-1003,2024-01-10,CUST-203,Dell XPS 15,Electronics,South,1,1899,1899,1450,449
ORD-1004,2024-01-14,CUST-204,Wireless Mouse,Electronics,East,12,45,540,240,300
ORD-1005,2024-01-18,CUST-205,Standing Desk,Furniture,North,3,650,1950,1350,600
ORD-1006,2024-01-22,CUST-206,Mechanical Keyboard,Electronics,West,8,120,960,560,400
ORD-1007,2024-01-25,CUST-207,Monitor 27-inch 4K,Electronics,East,4,450,1800,1200,600
ORD-1008,2024-01-28,CUST-208,USB-C Docking Station,Electronics,South,6,180,1080,660,420
ORD-1009,2024-01-30,CUST-209,Executive Desk,Furniture,North,2,850,1700,1150,550
ORD-1010,2024-02-02,CUST-210,Noise Cancelling Headphones,Electronics,West,7,299,2093,1330,763
ORD-1011,2024-02-04,CUST-211,MacBook Pro 14,Electronics,North,3,1999,5997,4500,1497
ORD-1012,2024-02-08,CUST-212,Filing Cabinet,Office Supplies,East,10,140,1400,900,500
ORD-1013,2024-02-12,CUST-213,iPad Air,Electronics,South,4,599,2396,1760,636
ORD-1014,2024-02-15,CUST-214,Ergonomic Chair,furniture,West,4,350,1400,880,520
ORD-1015,2024-02-19,CUST-215,Laser Printer,Office Supplies,North,2,420,840,580,260
ORD-1016,2024-02-23,CUST-216,Desk Lamp LED,Furniture,East,15,65,975,450,525
ORD-1017,2024-02-25,CUST-217,Dell UltraSharp 32,Electronics,West,3,780,2340,1650,690
ORD-1018,2024-02-28,CUST-218,Wireless Headset,Electronics,South,9,150,1350,810,540
ORD-1019,2024-02-28,CUST-219,Standing Desk,Furniture,West,5,650,3250,2250,1000
ORD-1020,2024-03-03,CUST-220,Wireless Mouse,Electronics,North,10,45,450,200,250
ORD-1021,2024-03-06,CUST-221,Paper Reams Box,Office Supplies,East,25,35,875,500,375
ORD-1022,2024-03-10,CUST-222,iPad Pro 11,Electronics,West,2,799,1598,1220,378
ORD-1023,2024-03-15,,Office Supplies Organizer,Office Supplies,South,8,45,360,180,180
ORD-1024,2024-03-19,CUST-224,Monitor Arm Dual,Furniture,North,4,110,440,240,200
ORD-1025,2024-03-24,CUST-225,Mechanical Keyboard,Electronics,East,3,120,360,210,150
ORD-1026,2024-03-28,CUST-226,Ergonomic Footrest,Office Supplies,West,6,50,300,150,150
ORD-1027,2024-03-30,CUST-227,Whiteboard 4x6,Office Supplies,South,2,180,360,220,140
ORD-1028,2024-04-03,CUST-228,MacBook Air 13,Electronics,North,4,1099,4396,3300,1096
ORD-1029,2024-04-07,CUST-229,Executive Leather Chair,Furniture,West,3,480,1440,920,520
ORD-1030,2024-04-11,CUST-230,Dell XPS 13,Electronics,East,2,1399,2798,2100,698
ORD-1031,2024-04-15,CUST-231,Conference Table,Furniture,South,1,1650,1650,1050,600
ORD-1032,2024-04-18,CUST-232,Noise Cancelling Headphones,Electronics,North,5,299,1495,950,545
ORD-1033,2024-04-22,CUST-233,Mesh Office Chair,Furniture,West,6,220,1320,840,480
ORD-1034,2024-04-26,CUST-234,Laser Printer Pro,Office Supplies,East,3,550,1650,1100,550
ORD-1035,2024-04-29,CUST-235,Wireless Presenter,Office Supplies,South,10,60,600,280,320
ORD-1036,2024-05-04,CUST-236,MacBook Pro 16,Electronics,West,3,2499,7497,5700,1797
ORD-1037,2024-05-08,CUST-237,Standing Desk Electric,Furniture,North,4,720,2880,1960,920
ORD-1038,2024-05-12,CUST-238,Webcam 4K Ultra,Electronics,East,8,180,1440,880,560
ORD-1039,2024-05-16,CUST-239,Smart LED Lighting Kit,Furniture,South,5,150,750,420,330
ORD-1040,2024-05-20,CUST-240,iPad Air,Electronics,West,6,599,3594,2640,954
ORD-1041,2024-05-25,CUST-241,Shredder Heavy Duty,Office Supplies,North,3,280,840,540,300
ORD-1042,2024-05-29,CUST-242,Dell UltraSharp 27,Electronics,East,4,580,2320,1600,720
ORD-1043,2024-06-03,CUST-243,Server Rack 12U,Electronics,North,1,1200,1200,820,380
ORD-1044,2024-06-07,CUST-244,Ergonomic Chair,Furniture,West,5,350,1750,1100,650
ORD-1045,2024-06-11,CUST-245,Laminator Thermal,Office Supplies,South,7,85,595,350,245
ORD-1046,2024-06-15,CUST-246,Noise Cancelling Headphones,ELECTRONICS,East,6,299,1794,1140,654
ORD-1047,2024-06-20,CUST-247,MacBook Pro 14,Electronics,West,2,1999,3998,3000,998
ORD-1048,2024-06-24,CUST-248,Bookcase 5-Shelf,Furniture,North,4,210,840,520,320
ORD-1049,2024-06-28,CUST-249,Wireless Mouse,Electronics,South,14,45,630,280,350
ORD-1050,2024-07-02,CUST-250,Enterprise Cloud Server Unit,Electronics,West,1,8500,8500,5800,2700
ORD-1051,2024-07-06,CUST-251,Executive Desk,Furniture,East,2,850,1700,1150,550
ORD-1052,2024-07-10,CUST-252,Dell XPS 15,Electronics,North,3,1899,5697,4350,1347
ORD-1053,2024-07-15,CUST-253,Paper Reams Box,Office Supplies,West,20,35,700,400,300
ORD-1054,2024-07-19,CUST-254,Standing Desk,Furniture,South,3,650,1950,1350,600
ORD-1055,2024-07-24,CUST-255,iPad Pro 11,Electronics,North,4,799,3196,2440,756
ORD-1056,2024-07-28,CUST-256,Monitor 27-inch 4K,Electronics,West,5,450,2250,1500,750
ORD-1057,2024-08-02,CUST-257,Mechanical Keyboard,Electronics,South,6,120,720,420,300
ORD-1058,2024-08-06,CUST-258,Ergonomic Chair,Furniture,North,4,350,1400,880,520
ORD-1059,2024-08-11,CUST-259,MacBook Pro 16,Electronics,West,2,2499,4998,3800,1198
ORD-1060,2024-08-16,CUST-260,Desk Lamp LED,Furniture,East,8,65,520,240,280
ORD-1061,2024-08-21,CUST-261,Laser Printer,Office Supplies,South,2,420,840,580,260
ORD-1062,2024-08-25,CUST-262,Dell XPS 13,Electronics,North,3,1399,4197,3150,1047
ORD-1063,2024-08-30,CUST-263,Standing Desk Electric,Furniture,West,5,720,3600,2450,1150
ORD-1064,2024-09-04,CUST-264,Noise Cancelling Headphones,Electronics,East,8,299,2392,1520,872
ORD-1065,2024-09-09,CUST-265,USB-C Docking Station,Electronics,North,9,180,1620,990,630
ORD-1066,2024-09-14,CUST-266,Filing Cabinet,Office Supplies,South,5,140,700,450,250
ORD-1067,2024-09-19,CUST-267,Ergonomic Chair,Furniture,West,6,350,2100,1320,780
ORD-1068,2024-09-24,CUST-268,MacBook Air 13,Electronics,North,5,1099,5495,4125,1370
ORD-1069,2024-09-28,CUST-269,Wireless Headset,Electronics,East,7,150,1050,630,420
ORD-1070,2024-10-03,CUST-270,Dell UltraSharp 32,Electronics,West,4,780,3120,2200,920
ORD-1071,2024-10-08,CUST-271,Conference Table,Furniture,North,2,1650,3300,2100,1200
ORD-1072,2024-10-13,CUST-272,iPad Air,Electronics,South,5,599,2995,2200,795
ORD-1073,2024-10-18,CUST-273,Executive Desk,Furniture,West,3,850,2550,1725,825
ORD-1074,2024-10-23,CUST-274,Paper Reams Box,Office Supplies,East,30,35,1050,600,450
ORD-1075,2024-10-28,CUST-275,Standing Desk,Furniture,North,6,650,3900,2700,1200
ORD-1076,2024-11-02,CUST-276,MacBook Pro 16,Electronics,West,5,2499,12495,9500,2995
ORD-1077,2024-11-07,CUST-277,Monitor 27-inch 4K,Electronics,South,8,450,3600,2400,1200
ORD-1078,2024-11-12,CUST-278,Ergonomic Chair,Furniture,East,7,350,2450,1540,910
ORD-1079,2024-11-17,CUST-279,Dell XPS 15,Electronics,North,4,1899,7596,5800,1796
ORD-1080,2024-11-22,CUST-280,Noise Cancelling Headphones,Electronics,West,12,299,3588,2280,1308
ORD-1081,2024-11-26,CUST-281,Standing Desk Electric,Furniture,South,4,720,2880,1960,920
ORD-1082,2024-11-29,CUST-282,Enterprise Cloud Server Unit,Electronics,West,2,8500,17000,11600,5400
ORD-1083,2024-12-03,CUST-283,Wireless Mouse,Electronics,North,18,45,810,360,450
ORD-1084,2024-12-07,CUST-284,MacBook Pro 14,Electronics,East,4,1999,7996,6000,1996
ORD-1085,2024-12-11,CUST-285,Mesh Office Chair,Furniture,South,8,220,1760,1120,640
ORD-1086,2024-12-16,CUST-286,iPad Pro 11,Electronics,West,5,799,3995,3050,945
ORD-1087,2024-12-20,CUST-287,Laser Printer Pro,Office Supplies,North,4,550,2200,1460,740
ORD-1088,2024-12-24,CUST-288,Smart LED Lighting Kit,Furniture,East,10,150,1500,840,660
ORD-1089,2024-12-28,CUST-289,Dell UltraSharp 32,Electronics,West,5,780,3900,2750,1150
ORD-1044,2024-06-11,CUST-245,Laminator Thermal,Office Supplies,South,7,85,595,350,245
ORD-1019,2024-02-28,CUST-219,Standing Desk,Furniture,West,5,650,3250,2250,1000`;

export const SAMPLE_MARKETING_CSV: string = `campaign_id,start_date,channel,target_audience,impressions,clicks,spend,conversions,revenue,roas
CMP-101,2024-01-10,Google Ads,Enterprise IT,142000,4200,5200,210,18900,3.63
CMP-102,2024-01-18,Meta Ads,SMB Founders,280000,6800,4800,185,13500,2.81
CMP-103,2024-02-05,LinkedIn Ads,C-Suite Executives,95000,1900,6200,140,24800,4.00
CMP-104,2024-02-14,Email Newsletter,Existing Customers,45000,3100,850,290,14200,16.71
CMP-105,2024-03-01,YouTube Ads,Tech Enthusiasts,340000,5100,5900,130,8900,1.51
CMP-106,2024-03-15,Google Ads,High Intent Search,185000,7400,8100,420,37800,4.67
CMP-107,2024-04-02,Meta Ads,Startup Ops,310000,8200,6400,260,19200,3.00
CMP-108,2024-04-20,TikTok Ads,Gen-Z Creatives,420000,9800,4100,110,6200,1.51
CMP-109,2024-05-10,LinkedIn Ads,Product Managers,110000,2400,7100,175,28000,3.94
CMP-110,2024-05-25,Google Ads,B2B Software,210000,8900,9500,490,44100,4.64
CMP-111,2024-06-12,Email Newsletter,Re-engagement,52000,3800,920,330,16800,18.26
CMP-112,2024-06-28,Meta Ads,Remote Teams,260000,6100,4900,195,14500,2.96`;

export const SAMPLE_HR_CSV: string = `employee_id,department,job_role,gender,tenure_years,salary,performance_score,satisfaction_rating,attrition
EMP-301,Engineering,Software Engineer,Female,3,115000,4,4,No
EMP-302,Engineering,Senior Architect,Male,7,175000,5,5,No
EMP-303,Sales,Account Executive,Female,2,82000,3,3,Yes
EMP-304,Sales,Sales Manager,Male,5,130000,4,4,No
EMP-305,Marketing,Growth Specialist,Female,2,76000,4,3,No
EMP-306,Product,Product Designer,Female,4,105000,5,5,No
EMP-307,Product,Lead PM,Male,6,155000,4,4,No
EMP-308,Operations,Logistics Coordinator,Male,1,58000,2,2,Yes
EMP-309,HR,HR Business Partner,Female,4,88000,4,4,No
EMP-310,Engineering,DevOps Engineer,Male,3,122000,4,4,No
EMP-311,Sales,BDR Representative,Male,1,54000,3,2,Yes
EMP-312,Engineering,Staff Engineer,Female,8,190000,5,5,No
EMP-313,Marketing,Content Manager,Female,3,72000,3,3,No
EMP-314,Operations,Operations Director,Male,9,148000,4,4,No
EMP-315,Engineering,Data Scientist,Female,4,135000,5,5,No`;
