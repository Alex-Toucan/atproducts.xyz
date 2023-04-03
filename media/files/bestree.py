import numpy as np
from sklearn.metrics import accuracy_score
import argparse
import pandas as pd
from sklearn.datasets import load_breast_cancer, load_iris
from sklearn.tree import DecisionTreeClassifier as SklearnDecisionTreeClassifier
from sklearn.tree import export_graphviz
from sklearn.utils import Bunch
from sklearn import datasets
from sklearn.model_selection import train_test_split
from io import StringIO  # for StringIO

def gini_imp(y):
	if isinstance(y, pd.Series):
		p = y.value_counts()/y.shape[0]
		gini = 1-np.sum(p**2)
		return (gini)
	else:
		raise("Must be pandas object")

def entropy_imp(y):
	if isinstance(y, pd.Series):
		a = y.value_counts()/y.shape[0]
		entropy = np.sum(-a*np.log2(a+1e-9))
		return entropy
	else:
		raise("Must be pandas object")

def best_criterion(y):
	gini = gini_imp(y)
	ent = entropy_imp(y)

	if ent > gini:
		criterion = "entropy"
	else:
		criterion = "gini"
	return criterion
	

def best_depth(X, y, criterion="gini"):
	X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.33)
	l = 0
	d = 0
	max_depth = 1
	
	for i in range(1, 500):
		max_depth = i
		
		clf2 = SklearnDecisionTreeClassifier(criterion=criterion, max_depth=max_depth)
		clf2.fit(X_train, y_train)

		pred2 = clf2.predict(X_test)
		acc = accuracy_score(pred2, y_test)
		if acc > l:
			l = acc
			d = max_depth
	return d
	
def best_splitter(X, y, depths, criterion="gini"):
	X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.33)
	
	#best	
	clf2 = SklearnDecisionTreeClassifier(criterion=criterion, max_depth=depths, splitter="best")
	clf2.fit(X_train, y_train)

	pred2 = clf2.predict(X_test)
	acc = accuracy_score(pred2, y_test)
	
	#random
	clf2 = SklearnDecisionTreeClassifier(criterion=criterion, max_depth=depths, splitter="random")
	clf2.fit(X_train, y_train)

	pred2 = clf2.predict(X_test)
	acc2 = accuracy_score(pred2, y_test)
	#
	
	if acc > acc2:
		return "best"
	else:
		return "random"
		
def best_criterion_norm(X, y):
	X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.33)
	
	a = 0
	b = 0
	
	for i in range(1, 101):
		#gini
		clf2 = SklearnDecisionTreeClassifier(criterion="gini", max_depth=i)
		clf2.fit(X_train, y_train)

		pred2 = clf2.predict(X_test)
		acc = accuracy_score(pred2, y_test)
		
		#entropy
		clf2 = SklearnDecisionTreeClassifier(criterion="entropy", max_depth=i)
		clf2.fit(X_train, y_train)

		pred2 = clf2.predict(X_test)
		acc2 = accuracy_score(pred2, y_test)
		
		if acc > acc2:
			a += 1
		else:
			b += 1
	if a > b:
		return "gini"
	else:
		return "entropy"
	
def best_state(X, y, depth, criterion="gini"):
	X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.33)
	state = 0
	ac = 0
	for i in range(100):
		clf = SklearnDecisionTreeClassifier(criterion=criterion, max_depth=depth, random_state=i)
		clf.fit(X_train, y_train)
		pred = clf.predict(X_test)
		acc = accuracy_score(pred, y_test)
		
		if acc > ac:
			state = i
			ac = acc
		#print(acc)
	#print(state)
	return state
		
	
		
def best_all(X, y):
	if isinstance(y, pd.Series):
		#Getting the best criterion
		criterion = best_criterion(y)
		
		#Getting best depth value
		depth = best_depth(X, y, criterion=criterion)
		
		#Getting best splitter
		split = best_splitter(X, y, depth, criterion=criterion)
		
		return criterion, depth, split
	else:
		#Getting the best criterion
		criterion = best_criterion_norm(X, y)
		
		#Getting best depth value
		depth = best_depth(X, y, criterion=criterion)
		
		#Getting best splitter
		split = best_splitter(X, y, depth, criterion=criterion)
		
		return criterion, depth, split
		
	
