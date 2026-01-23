def parse_number_list(raw: str):
    text = raw.strip()
    if not text:
        return {"ok": False, "error": "You did not enter any numbers."}

    # supports spaces and commas
    parts = [p for p in text.replace(",", " ").split() if p]

    try:
        nums = [int(p) for p in parts]
        return {"ok": True, "value": nums}
    except ValueError:
        return {"ok": False, "error": "Invalid input: please enter only integers."}


def parse_number(raw: str):
    text = raw.strip()
    try:
        return {"ok": True, "value": int(text)}
    except ValueError:
        return {"ok": False, "error": "Please enter a valid integer."}
