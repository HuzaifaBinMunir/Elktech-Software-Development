from algorithms.sort import bubble_sort, insertion_sort, merge_sort
from menu.menu_printer import print_sort_menu


def run_sort_flow(arr):
    print_sort_menu()
    choice = input("Select sort type (1-3) or 0 to go back: ").strip()

    if choice == "0":
        return

    if choice == "1":
        print("\nOriginal:", arr)
        print("Insertion Sort:", insertion_sort(arr))
        return

    if choice == "2":
        print("\nOriginal:", arr)
        print("Bubble Sort:", bubble_sort(arr))
        return

    if choice == "3":
        print("\nOriginal:", arr)
        print("Merge Sort:", merge_sort(arr))
        return

    print("Invalid sort option.")
