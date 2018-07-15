#!/bin/bash

echo "Configuring DB"

dropdb -U node_user Frendo
createdb -U node_user Frendo

psql Frendo < ./bin/sql/frendo.sql

echo "DB configured"