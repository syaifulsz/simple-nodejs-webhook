#!/bin/sh

RUN_TEST_BEGIN=`date +%s`;
echo "Run Test Begin!: $(date)" >> test.txt;
# echo "Run Test Begin!";

sleep 2;

RUN_TEST_END=`date +%s`;
echo "Run Test Done!: $(date)" >> test.txt;
# echo "Run Test Done!";

 
RUN_TEST_TIME=$((RUN_TEST_END-RUN_TEST_BEGIN))

echo "{ \"RUN_TEST_BEGIN\": \"$RUN_TEST_BEGIN\", \"RUN_TEST_END\": \"$RUN_TEST_END\", \"RUN_TEST_TIME\": \"$RUN_TEST_TIME\" }";