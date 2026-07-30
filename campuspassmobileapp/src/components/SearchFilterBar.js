import React from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity, Text, ScrollView } from 'react-native';
import { Search, X } from 'lucide-react-native';

const SearchFilterBar = ({
  searchTerm = "",
  onSearchChange,
  placeholder = "Search events, venues...",
  categories = [],
  selectedCategory = "",
  onCategoryChange
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <Search size={20} color="#9ca3af" style={styles.searchIcon} />
        <TextInput
          style={styles.input}
          value={searchTerm}
          onChangeText={onSearchChange}
          placeholder={placeholder}
          placeholderTextColor="#6b7280"
        />
        {searchTerm ? (
          <TouchableOpacity onPress={() => onSearchChange && onSearchChange("")} style={styles.clearButton}>
            <X size={16} color="#9ca3af" />
          </TouchableOpacity>
        ) : null}
      </View>
      
      {categories && categories.length > 0 && (
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryScroll}
        >
          <TouchableOpacity 
            style={[styles.categoryChip, !selectedCategory && styles.categoryChipActive]}
            onPress={() => onCategoryChange && onCategoryChange("")}
          >
            <Text style={[styles.categoryText, !selectedCategory && styles.categoryTextActive]}>All</Text>
          </TouchableOpacity>
          
          {categories.map(cat => (
            <TouchableOpacity
              key={cat._id || cat.id}
              style={[
                styles.categoryChip, 
                selectedCategory === (cat._id || cat.name) && styles.categoryChipActive
              ]}
              onPress={() => onCategoryChange && onCategoryChange(cat._id || cat.name)}
            >
              <Text style={[
                styles.categoryText,
                selectedCategory === (cat._id || cat.name) && styles.categoryTextActive
              ]}>
                {cat.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(18, 18, 26, 0.6)',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    padding: 16,
    marginBottom: 16,
    gap: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#181824',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    height: 50,
  },
  searchIcon: {
    marginLeft: 16,
  },
  input: {
    flex: 1,
    color: '#ffffff',
    paddingHorizontal: 12,
    fontSize: 14,
  },
  clearButton: {
    padding: 12,
  },
  categoryScroll: {
    gap: 8,
    paddingRight: 16,
  },
  categoryChip: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  categoryChipActive: {
    backgroundColor: 'rgba(37, 99, 235, 0.2)',
    borderColor: 'rgba(59, 130, 246, 0.5)',
  },
  categoryText: {
    color: '#9ca3af',
    fontSize: 12,
    fontWeight: 'bold',
  },
  categoryTextActive: {
    color: '#60a5fa',
  }
});

export default SearchFilterBar;
