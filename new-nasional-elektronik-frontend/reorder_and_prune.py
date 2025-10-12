import json

def reorder_and_prune_with_id(input_path: str, output_path: str, start_id: int = 12) -> None:
    """
    Reads a JSON array from input_path, keeps only the keys in the specified order,
    adds an incremental 'id' starting from start_id, and writes the result to output_path.
    Desired key order:
      id, slug, title, mainImage, price, rating,
      description, manufacturer, inStock, categoryId
    """
    # Load the original data
    with open(input_path, 'r', encoding='utf-8') as infile:
        original = json.load(infile)

    # Reorder, prune, and add 'id'
    transformed = []
    for idx, item in enumerate(original, start=start_id):
        transformed.append({
            'id': idx,
            'slug': item.get('slug', ''),
            'title': item.get('title', ''),
            'mainImage': item.get('mainImage', ''),
            'price': item.get('price', 0),
            'rating': item.get('rating', 0),
            'description': item.get('description', ''),
            'manufacturer': item.get('manufacturer', ''),
            'inStock': item.get('inStock', 0),
            'categoryId': item.get('categoryId', '')
        })

    # Write the updated list back out
    with open(output_path, 'w', encoding='utf-8') as outfile:
        json.dump(transformed, outfile, indent=2, ensure_ascii=False)

if __name__ == "__main__":
    reorder_and_prune_with_id('output.json', 'output2.json')
