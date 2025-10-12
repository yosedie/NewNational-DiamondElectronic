import json
import mysql.connector

conn = mysql.connector.connect(
    host="localhost", user="root", password="", database="singitronic_nextjs"
)
cursor = conn.cursor()
with open('output2.json') as f:
    rows = json.load(f)
for r in rows:
    cursor.execute(
        """
            INSERT INTO product
            (id, slug, title, mainImage, price, rating,
            description, manufacturer, inStock, categoryId)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        """,
        (
            r['id'], r['slug'], r['title'], r['mainImage'], r['price'], r['rating'],
            r['description'], r['manufacturer'], r['inStock'], r['categoryId']
        )
    )
conn.commit()
