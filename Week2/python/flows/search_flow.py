from algorithms.search import linear_search, binary_search
from menu.menu_printer import print_search_menu
from utils.parse import parse_number


def get_target_from_user():
    while True:
        raw = input("Enter target number (e.g. 7): ")
        parsed = parse_number(raw)
        if parsed["ok"]:
            return parsed["value"]
        print(f"Error: {parsed['error']} Try again.")


def run_search_flow(arr):
    print_search_menu()
    choice = input("Select search type (1-2) or 0 to go back: ").strip()

    if choice == "0":
        return

    target = get_target_from_user()

    if choice == "1":
        idx = linear_search(arr, target)
        print("\nArray:", arr)
        print("Result:", "Not found" if idx == -1 else f"Found at index {idx}")
        return

    if choice == "2":
        sorted_arr = sorted(arr)
        idx = binary_search(sorted_arr, target)
        print("\nSorted Array (for Binary Search):", sorted_arr)
        print("Result:", "Not found" if idx == -1 else f"Found at index {idx}")
        return

    print("Invalid search option.")
