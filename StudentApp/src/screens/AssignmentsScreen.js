import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { studentInfo, subjects, schedule, assignments, grades } from '../data/sampleData';

const ASYNC_STORAGE_KEY = 'assignments_status';

const formatDate = (dateStr) => {
  if (!dateStr) return '';
  const parts = dateStr.split('-');
  if (parts.length === 3) {
    return `${parts[2]}/${parts[1]}/${parts[0]}`;
  }
  return dateStr;
};

const getRemainingDaysInfo = (hanNopStr) => {
  if (!hanNopStr) return { text: '', isOverdue: false };
  const parts = hanNopStr.split('-').map(Number);
  if (parts.length !== 3) return { text: '', isOverdue: false };

  const dueDate = new Date(parts[0], parts[1] - 1, parts[2]);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  dueDate.setHours(0, 0, 0, 0);

  const diffTime = dueDate.getTime() - today.getTime();
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    return { text: `Quá hạn ${Math.abs(diffDays)} ngày`, isOverdue: true };
  } else if (diffDays === 0) {
    return { text: 'Hết hạn hôm nay', isOverdue: false };
  } else {
    return { text: `Còn ${diffDays} ngày`, isOverdue: false };
  }
};

const TAB_ALL = 'Tất cả';
const TAB_PENDING = 'Chưa hoàn thành';
const TAB_COMPLETED = 'Đã hoàn thành';

const AssignmentsScreen = ({ navigation }) => {
  const [assignmentList, setAssignmentList] = useState(assignments);
  const [selectedTab, setSelectedTab] = useState(TAB_ALL);

  const loadAssignmentsFromStorage = useCallback(async () => {
    try {
      const saved = await AsyncStorage.getItem(ASYNC_STORAGE_KEY);
      if (saved) {
        setAssignmentList(JSON.parse(saved));
      } else {
        setAssignmentList(assignments);
      }
    } catch (error) {
      console.error('Lỗi khi tải dữ liệu bài tập:', error);
      setAssignmentList(assignments);
    }
  }, []);

  useEffect(() => {
    loadAssignmentsFromStorage();
  }, [loadAssignmentsFromStorage]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadAssignmentsFromStorage();
    });
    return unsubscribe;
  }, [navigation, loadAssignmentsFromStorage]);

  const toggleComplete = async (id) => {
    const updated = assignmentList.map((item) => {
      if (item.id === id) {
        const current = !!(item.hoangThanh ?? item.hoanThanh);
        return {
          ...item,
          hoangThanh: !current,
          hoanThanh: !current,
        };
      }
      return item;
    });

    setAssignmentList(updated);
    try {
      await AsyncStorage.setItem(ASYNC_STORAGE_KEY, JSON.stringify(updated));
    } catch (error) {
      console.error('Lỗi khi lưu trạng thái bài tập:', error);
    }
  };

  const filteredAssignments = useMemo(() => {
    return assignmentList.filter((item) => {
      const isDone = !!(item.hoangThanh ?? item.hoanThanh);
      if (selectedTab === TAB_COMPLETED) return isDone;
      if (selectedTab === TAB_PENDING) return !isDone;
      return true;
    });
  }, [assignmentList, selectedTab]);

  const renderAssignmentItem = ({ item }) => {
    const isDone = !!(item.hoangThanh ?? item.hoanThanh);
    const remaining = getRemainingDaysInfo(item.hanNop);

    return (
      <TouchableOpacity
        style={[styles.card, isDone && styles.cardCompleted]}
        activeOpacity={0.8}
        onPress={() =>
          navigation.navigate('AssignmentDetail', {
            assignment: item,
            onToggleStatus: () => toggleComplete(item.id),
          })
        }
      >
        <View style={styles.cardHeader}>
          <View style={styles.subjectTag}>
            <Ionicons name="book-outline" size={13} color="#4A90D9" />
            <Text style={styles.subjectTagText}>{item.tenMH}</Text>
          </View>
          <View
            style={[
              styles.statusBadge,
              isDone
                ? styles.badgeCompleted
                : remaining.isOverdue
                ? styles.badgeOverdue
                : styles.badgePending,
            ]}
          >
            <Text
              style={[
                styles.statusBadgeText,
                isDone
                  ? styles.textCompleted
                  : remaining.isOverdue
                  ? styles.textOverdue
                  : styles.textPending,
              ]}
            >
              {isDone ? 'Đã hoàn thành' : remaining.isOverdue ? 'Quá hạn' : 'Chưa hoàn thành'}
            </Text>
          </View>
        </View>

        <Text style={[styles.title, isDone && styles.titleCompleted]}>
          {item.tieuDe}
        </Text>

        <View style={styles.cardFooter}>
          <View style={styles.dateContainer}>
            <Ionicons name="calendar-outline" size={14} color="#718096" />
            <Text style={styles.dateText}>Hạn: {formatDate(item.hanNop)}</Text>
            {!isDone && (
              <View
                style={[
                  styles.remainingBadge,
                  remaining.isOverdue ? styles.remainingOverdue : styles.remainingNormal,
                ]}
              >
                <Text
                  style={[
                    styles.remainingText,
                    remaining.isOverdue ? styles.remainingTextOverdue : styles.remainingTextNormal,
                  ]}
                >
                  {remaining.text}
                </Text>
              </View>
            )}
          </View>

          <TouchableOpacity
            style={[styles.checkButton, isDone ? styles.checkButtonDone : styles.checkButtonPending]}
            onPress={() => toggleComplete(item.id)}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Ionicons
              name={isDone ? 'checkmark-circle' : 'ellipse-outline'}
              size={24}
              color={isDone ? '#4CAF50' : '#A0AEC0'}
            />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  const renderEmptyComponent = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="checkmark-done-circle-outline" size={60} color="#CBD5E0" />
      <Text style={styles.emptyText}>Không có bài tập nào</Text>
      <Text style={styles.emptySubText}>
        {selectedTab === TAB_COMPLETED
          ? 'Bạn chưa hoàn thành bài tập nào trong mục này.'
          : selectedTab === TAB_PENDING
          ? 'Tuyệt vời! Bạn đã hoàn thành tất cả bài tập.'
          : 'Hiện tại chưa có bài tập nào được giao.'}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#F5F7FA" />
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Bài tập & Nhiệm vụ</Text>
          <Text style={styles.headerSubtitle}>
            Theo dõi tiến độ hoàn thành các bài tập
          </Text>
        </View>

        <View style={styles.tabContainer}>
          {[TAB_ALL, TAB_PENDING, TAB_COMPLETED].map((tab) => {
            const isSelected = selectedTab === tab;
            return (
              <TouchableOpacity
                key={tab}
                style={[styles.tabButton, isSelected && styles.tabButtonActive]}
                onPress={() => setSelectedTab(tab)}
              >
                <Text
                  style={[styles.tabButtonText, isSelected && styles.tabButtonTextActive]}
                >
                  {tab}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <FlatList
          data={filteredAssignments}
          keyExtractor={(item) => item.id}
          renderItem={renderAssignmentItem}
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
  tabContainer: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginVertical: 12,
    backgroundColor: '#E2E8F0',
    borderRadius: 12,
    padding: 4,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 9,
  },
  tabButtonActive: {
    backgroundColor: '#4A90D9',
    shadowColor: '#4A90D9',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3,
    elevation: 2,
  },
  tabButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
  },
  tabButtonTextActive: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
    paddingTop: 4,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 5,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#EEF2F6',
  },
  cardCompleted: {
    opacity: 0.9,
    backgroundColor: '#FAFCFA',
    borderColor: '#E2F0D9',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  subjectTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EBF4FE',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    maxWidth: '60%',
  },
  subjectTagText: {
    fontSize: 12,
    color: '#4A90D9',
    fontWeight: '600',
    marginLeft: 4,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  badgeCompleted: {
    backgroundColor: '#E8F5E9',
  },
  badgePending: {
    backgroundColor: '#FFF3E0',
  },
  badgeOverdue: {
    backgroundColor: '#FFEBEE',
  },
  statusBadgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  textCompleted: {
    color: '#4CAF50',
  },
  textPending: {
    color: '#FF9800',
  },
  textOverdue: {
    color: '#FF6B6B',
  },
  title: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#2D3748',
    marginBottom: 10,
    lineHeight: 21,
  },
  titleCompleted: {
    color: '#718096',
    textDecorationLine: 'line-through',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    flex: 1,
  },
  dateText: {
    fontSize: 12,
    color: '#718096',
    marginLeft: 4,
    marginRight: 8,
  },
  remainingBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  remainingNormal: {
    backgroundColor: '#FFF8E1',
  },
  remainingOverdue: {
    backgroundColor: '#FFEBEE',
  },
  remainingText: {
    fontSize: 11,
    fontWeight: '600',
  },
  remainingTextNormal: {
    color: '#F57C00',
  },
  remainingTextOverdue: {
    color: '#FF6B6B',
  },
  checkButton: {
    padding: 2,
  },
  checkButtonPending: {},
  checkButtonDone: {},
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    marginTop: 14,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4A5568',
  },
  emptySubText: {
    marginTop: 6,
    fontSize: 13,
    color: '#94A3B8',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
});

export default AssignmentsScreen;
