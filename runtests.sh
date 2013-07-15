#!/bin/bash

rm -r virtualenv *.egg-info
virtualenv virtualenv
. virtualenv/bin/activate
pip install -r requirements.txt --quiet
python setup.py -q develop
python -m swag.manage test