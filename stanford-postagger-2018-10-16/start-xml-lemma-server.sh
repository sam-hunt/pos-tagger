java -mx300m -cp 'stanford-postagger-2018-10-16/stanford-postagger.jar:' edu.stanford.nlp.tagger.maxent.MaxentTaggerServer \
-model ./stanford-postagger-2018-10-16/models/english-left3words-distsim.tagger \
-port 8889 \
-outputFormat xml \
-outputFormatOptions lemmatize

/home/shunt/dev/pos-tagger/stanford-corenlp-full-2018-10-05/stanford-corenlp-3.9.2.jar

java -Xmx4g -cp "./stanford-corenlp-full-2018-10-05/*" edu.stanford.nlp.pipeline.StanfordCoreNLP -annotators tokenize,ssplit,truecase,pos,lemma,ner,depparse -port 8890 -outputFormat json


java -Xmx4g -cp "./stanford-corenlp-full-2018-10-05/*" edu.stanford.nlp.pipeline.StanfordCoreNLPServer \
-port 9000 \
-outputFormat json \
-timeout 15000 \
-annotators tokenize,ssplit,truecase,pos,lemma,ner,depparse

THESE BELOW WORK

java -Xmx4g -cp "./stanford-corenlp-full-2018-10-05/*" edu.stanford.nlp.pipeline.StanfordCoreNLPServer -port 9000 -outputFormat json -timeout 15000 -annotators tokenize,ssplit,truecase,pos,lemma,ner,depparse

curl --data 'The quick brown fox jumped over the lazy dog.' 'http://localhost:9000/?properties={%22annotators%22%3A%22tokenize%2Cssplit%2Ctruecase%2Cpos%2Clemma%2Cner%2Cdepparse%22%2C%22outputFormat%22%3A%22json%22}' -o -
