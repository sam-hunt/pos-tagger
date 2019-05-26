java -mx300m -cp 'stanford-postagger-2018-10-16/stanford-postagger.jar:' edu.stanford.nlp.tagger.maxent.MaxentTagger \
-model ./stanford-postagger-2018-10-16/models/english-left3words-distsim.tagger \
-outputFormat inlineXML \
-outputFormatOptions lemmatize