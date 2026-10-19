export const sampleData=[
['Studio headphones','AUD-001','Electronics',3499,24,8,'Soundworks'],
['Mechanical keyboard','KEY-002','Electronics',4299,7,10,'Keycraft'],
['Aluminium desk stand','DSK-003','Workspace',1899,32,10,'Form Studio'],
['Canvas everyday tote','BAG-004','Lifestyle',799,0,5,'Everyday Co.'],
['Braided USB-C cable','CBL-005','Accessories',499,56,15,'Connect'],
['Softcover notebook','NTE-006','Workspace',349,18,10,'Paper & Co.'],
['Insulated steel bottle','BTL-007','Lifestyle',1199,6,8,'Everyday Co.'],
['Wireless desk charger','CHG-008','Accessories',1499,21,8,'Connect']
].map(([name,sku,category,price,quantity,reorderLevel,supplier])=>({name,sku,category,price,quantity,reorderLevel,supplier}));
