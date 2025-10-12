import json

def add_manufacturer(input_path: str, output_path: str) -> None:
    """
    Reads a JSON array from input_path, adds a 'manufacturer' field to each object
    based on the first word of its 'title', then writes the result to output_path.
    """
    # Load existing JSON data
    with open(input_path, 'r', encoding='utf-8') as infile:
        data = json.load(infile)

    # Process each item to add the manufacturer key
    for item in data:
        title = item.get('title', '')
        if title:
            first_word = title.split()[0]
            item['manufacturer'] = first_word.capitalize()
        else:
            item['manufacturer'] = ''

    # Write the updated data back to a new JSON file
    with open(output_path, 'w', encoding='utf-8') as outfile:
        json.dump(data, outfile, indent=2, ensure_ascii=False)

if __name__ == "__main__":
    # Example usage: transform 'input.json' to 'output.json'
    add_manufacturer('db_new_nasional.products.json', 'output.json')
