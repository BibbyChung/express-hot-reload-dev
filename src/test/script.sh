#!/bin/sh
set -e

P_CONDITION=$1
P_FILEPATH=$2

# echo ${P_CONDITION}
# echo ${P_FILEPATH}

if [[ "${P_CONDITION}" == 'bc-change' ]]
then
  sh -c "sed -i -e \"s@Bibby@BibbyChung@\" ${P_FILEPATH}"  
fi

if [[ "${P_CONDITION}" == 'bc-revert' ]]
then
  sh -c "sed -i -e \"s@BibbyChung@Bibby@\" ${P_FILEPATH}"  
fi

if [[ "${P_CONDITION}" == 'mk-change' ]]
then
  sh -c "sed -i -e \"s@Go to Market@Go to Market11@\" ${P_FILEPATH}"  
fi

if [[ "${P_CONDITION}" == 'mk-revert' ]]
then
  sh -c "sed -i -e \"s@Go to Market11@Go to Market@\" ${P_FILEPATH}"  
fi
