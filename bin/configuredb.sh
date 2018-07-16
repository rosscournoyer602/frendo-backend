#!/bin/bash

echo "Configuring DB"

# make sure you have a postgres superuser named node_user, or change this to the name of your postgres user
createdb -U node_user Frendo

psql Frendo < ./bin/sql/frendo.sql

echo "DB configured"