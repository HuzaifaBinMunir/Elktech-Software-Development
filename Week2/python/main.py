from menu.menu_printer import print_main_menu
from flows.search_flow import run_search_flow
from flows.sort_flow import run_sort_flow
from utils.parse import parse_number_list


def get_array_from_user():
    while True:
        raw = input("\nEnter array numbers (space or comma separated), e.g. 10 3 25 7 1: ")
        parsed = parse_number_list(raw)

        if parsed["ok"]:
            return parsed["value"]

        print(f"Error: {parsed['error']} Try again.")


def show_welcome_menu():
    print("\n=== Welcome (Python) ===")
    print("1. Start")
    print("0. Exit")


def main():
    try:
        # ✅ Welcome step (Start/Exit) BEFORE asking for the array
        while True:
            show_welcome_menu()
            start_choice = input("Select an option: ").strip()

            if start_choice == "0":
                print("Goodbye!")
                return

            if start_choice == "1":
                break

            print("Invalid option. Try again.")

        # Only ask for array after user chooses Start
        arr = get_array_from_user()

        while True:
            print_main_menu()
            action = input("Select an action (1-2) or 0 to Exit: ").strip()

            if action == "0":
                print("Goodbye!")
                return

            if action == "1":
                run_search_flow(arr)
                continue

            if action == "2":
                run_sort_flow(arr)
                continue

            print("Invalid action. Please choose 1, 2, or 0.")

    except KeyboardInterrupt:
        print("\nExiting...")


if __name__ == "__main__":
    main()
