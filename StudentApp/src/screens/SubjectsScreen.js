import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { studentInfo, subjects, schedule, assignments, grades } from '../data/sampleData';

const SubjectsScreen = ({ navigation }) => {
  const [searchText, setSearchText] = useState('');

  const filteredSubjects = useMemo(() => {
    if (!searchText.trim()) {
      return subjects;
    }
    const query = searchText.toLowerCase().trim();
    return subjects.filter(
      (item) =>
        item.tenMH.toLowerCase().includes(query) ||
        item.maMH.toLowerCase().includes(query)
    );
  }, [searchText]);

  const renderSubjectItem = ({ item }) => {
    return (
      <TouchableOpacity
        style={styles.card}
        activeOpacity={0.8}
        onPress={() => navigation.navigate('SubjectDetail', { subject: item })}
      >
        <View style={styles.cardHeader}>
          <View style={styles.codeBadge}>
            <Text style={styles.codeText}>{item.maMH}</Text>
          </View>
          <View style={styles.creditsBadge}>
            <Ionicons name="ribbon-outline" size={14} color="#4A90D9" />
            <Text style={styles.creditsText}>{item.soTinChi} tín chỉ</Text>
          </View>
        </View>

        <Text style={styles.subjectName}>{item.tenMH}</Text>

        <View style={styles.teacherRow}>
          <Ionicons name="person-outline" size={16} color="#666" />
          <Text style={styles.teacherText}>{item.giangVien}</Text>
        </View>

        <View style={styles.progressSection}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressLabel}>Tiến độ học tập</Text>
            <Text style={styles.progressValue}>{item.tienDo}%</Text>
          </View>
          <View style={styles.progressBarTrack}>
            <View
              style={[
                styles.progressBarFill,
                {
                  width: `${Math.min(Math.max(item.tienDo, 0), 100)}%`,
                  backgroundColor:
                    item.tienDo >= 80
                      ? '#4CAF50'
                      : item.tienDo >= 50
                      ? '#4A90D9'
                      : '#FF9800',
                },
              ]}
            />
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderEmptyComponent = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="search-outline" size={60} color="#B0B9C6" />
      <Text style={styles.emptyText}>Không tìm thấy môn học</Text>
      <Text style={styles.emptySubText}>
        Thử tìm kiếm với từ khóa khác hoặc mã môn học
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#F5F7FA" />
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Danh sách môn học</Text>
          <Text style={styles.headerSubtitle}>
            Tổng số: {filteredSubjects.length} môn học
          </Text>
        </View>

        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#8E9AA8" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Tìm kiếm môn học theo tên hoặc mã..."
            placeholderTextColor="#8E9AA8"
            value={searchText}
            onChangeText={setSearchText}
            clearButtonMode="while-editing"
          />
          {searchText.length > 0 && (
            <TouchableOpacity onPress={() => setSearchText('')}>
              <Ionicons name="close-circle" size={18} color="#8E9AA8" />
            </TouchableOpacity>
          )}
        </View>

        <FlatList
          data={filteredSubjects}
          keyExtractor={(item) => item.id || item.maMH}
          renderItem={renderSubjectItem}
          ListEmptyComponent={renderEmptyComponent}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1A2530',
  },
  headerSubtitle: {
    fontSize: 13,
    color: '#707E94',
    marginTop: 2,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginVertical: 10,
    paddingHorizontal: 14,
    height: 46,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#2D3748',
    paddingVertical: 0,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
    paddingTop: 6,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#F0F4F8',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  codeBadge: {
    backgroundColor: '#E8F2FD',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  codeText: {
    color: '#4A90D9',
    fontSize: 12,
    fontWeight: '700',
  },
  creditsBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F7FF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  creditsText: {
    fontSize: 12,
    color: '#4A90D9',
    fontWeight: '600',
    marginLeft: 4,
  },
  subjectName: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#1A2530',
    marginBottom: 8,
  },
  teacherRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  teacherText: {
    fontSize: 13,
    color: '#556575',
    marginLeft: 6,
  },
  progressSection: {
    marginTop: 4,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  progressLabel: {
    fontSize: 12,
    color: '#707E94',
  },
  progressValue: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1A2530',
  },
  progressBarTrack: {
    height: 8,
    backgroundColor: '#EEF2F6',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    marginTop: 16,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4A5568',
  },
  emptySubText: {
    marginTop: 6,
    fontSize: 13,
    color: '#94A3B8',
    textAlign: 'center',
  },
});

export default SubjectsScreen;
