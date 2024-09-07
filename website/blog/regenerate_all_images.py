import os
import subprocess

def run_python_files_in_subdirectories(root_dir='.', exclude_files=None):
    """
    Traverse all subdirectories from the specified root directory and execute each Python file using python3.
    Skips the files listed in exclude_files. The script changes to each subdirectory before running the Python files.

    :param root_dir: The root directory from which to start the traversal. Default is the current directory.
    :param exclude_files: List of filenames to exclude from execution.
    """
    if exclude_files is None:
        exclude_files = []

    for subdir, _, files in os.walk(root_dir):
        for file in files:
            if file.endswith('.py') and file not in exclude_files:
                file_path = os.path.join(subdir, file)
                print(f"Running {file_path}...")

                # Change to the subdirectory where the Python file is located
                original_dir = os.getcwd()  # Save the current directory
                os.chdir(subdir)  # Change to the subdirectory

                try:
                    subprocess.run(['python3', file], check=True)
                except subprocess.CalledProcessError as e:
                    print(f"Error running {file_path}: {e}")
                except Exception as e:
                    print(f"An unexpected error occurred: {e}")
                finally:
                    os.chdir(original_dir)  # Change back to the original directory

if __name__ == "__main__":
    # Replace '.' with any specific directory you want to start the search from
    # List the files to exclude from execution
    exclude_files = ['regenerate_all_images.py', 'globals.py']
    
    run_python_files_in_subdirectories('.', exclude_files)

