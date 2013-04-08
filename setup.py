# CHANGE THESE
name = "swag"
author = 'Engineering'
email = 'Jerry.Gomez@spilgames.com'
description = 'spil work applicant game'
# END CHANGE THESE
 
import os
from setuptools import setup, find_packages
 
try:
    from version import __version__ as version
except ImportError:
    version = 'noversion'
 
requirements = [x.strip() for x in open('requirements.txt').readlines() if not x.startswith('-e')]
long_description = open('README.md').read()
 
setup(
    name = name,
    version = version,
    author=author,
    author_email=email,
    description=description,
    long_description = long_description,
    url = "https://github.com/spilgames/spilgames/%s" % name,
    packages = find_packages(),
    install_requires=requirements,
    zip_safe=False,
    include_package_data=True,
)

