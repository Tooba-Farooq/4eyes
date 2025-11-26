import os
import sys
import django

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'For_eyes.settings')  # Change 'For_eyes' to your project name
django.setup()

# Now import Django stuff
from django.core.management import call_command
from io import StringIO

# Force UTF-8
sys.stdout.reconfigure(encoding='utf-8')

# Capture output
out = StringIO()
call_command('dumpdata', '--natural-foreign', '--natural-primary', '--indent=4', stdout=out)

# Write to file with UTF-8
with open('data_dump.json', 'w', encoding='utf-8') as f:
    f.write(out.getvalue())

print("✅ Data dumped successfully with UTF-8 encoding!")