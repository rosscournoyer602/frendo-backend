#!/bin/bash

echo "Configuring DB"

# make sure you have a postgres superuser named node_user, or change 'node_user' to the 
# name of your desired postgres user
createdb -U node_user Frendo

psql Frendo < ./bin/sql/frendo.sql

echo "DB configured"