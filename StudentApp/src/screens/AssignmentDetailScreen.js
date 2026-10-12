import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
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

const getDueStatusInfo = (hanNopStr) => {
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
    return {
      text: `Đã quá hạn ${Math.abs(diffDays)} ngày`,
      isOverdue: true,
      tag: 'Đã quá hạn',
    };
  } else if (diffDays === 0) {
    return {
      text: 'Hạn nộp là hôm nay',
      isOverdue: false,
      tag: 'Hôm nay',
    };
  } else {
    return {
      text: `Còn lại ${diffDays} ngày để hoàn thành`,
      isOverdue: false,
      tag: `Còn ${diffDays} ngày`,
    };
  }
};

const AssignmentDetailScreen = ({ route, navigation }) => {
  const assignmentParam = route.params?.assignment || {};
  const [isCompleted, setIsCompleted] = useState(
    !!(assignmentParam.hoangThanh ?? assignmentParam.hoanThanh)
  );

  const dueInfo = getDueStatusInfo(assignmentParam.hanNop);

  const handleToggleStatus = async () => {
    const nextStatus = !isCompleted;
    setIsCompleted(nextStatus);

    try {
      const stored = await AsyncStorage.getItem(ASYNC_STORAGE_KEY);
      let list = stored ? JSON.parse(stored) : assignments;
      const updatedList = list.map((item) => {
        if (item.id === assignmentParam.id) {
          return {
            ...item,
            hoangThanh: nextStatus,
            hoanThanh: nextStatus,
          };
        }
        return item;
      });
      await AsyncStorage.setItem(ASYNC_STORAGE_KEY, JSON.stringify(updatedList));
    } catch (error) {
      console.error('Lỗi khi cập nhật trạng thái bài tập:', error);
    }

    if (route.params?.onToggleStatus) {
      route.params.onToggleStatus();
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#F5F7FA" />
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Tiêu đề chính */}
        <View style={styles.headerCard}>
          <View style={styles.statusBadgeRow}>
            <View
              style={[
                styles.statusBadge,
                isCompleted
                  ? styles.badgeCompleted
                  : dueInfo.isOverdue
                  ? styles.badgeOverdue
                  : styles.badgePending,
              ]}
            >
              <Ionicons
                name={
                  isCompleted
                    ? 'checkmark-circle'
                    : dueInfo.isOverdue
                    ? 'alert-circle'
                    : 'time'
                }
                size={14}
                color={
                  isCompleted
                    ? '#4CAF50'
                    : dueInfo.isOverdue
                    ? '#FF6B6B'
                    : '#FF9800'
                }
              />
              <Text
                style={[
                  styles.statusBadgeText,
                  isCompleted
                    ? styles.textCompleted
                    : dueInfo.isOverdue
                    ? styles.textOverdue
                    : styles.textPending,
                ]}
              >
                {isCompleted
                  ? 'Đã hoàn thành'
                  : dueInfo.isOverdue
                  ? 'Quá hạn nộp'
                  : 'Chưa hoàn thành'}
              </Text>
            </View>
          </View>

          <Text style={styles.mainTitle}>{assignmentParam.tieuDe}</Text>
        </View>

        {/* Thông tin môn học */}
        <View style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <View style={styles.cardIconBox}>
              <Ionicons name="book" size={18} color="#4A90D9" />
            </View>
            <Text style={styles.cardSectionTitle}>Môn học</Text>
          </View>

          <View style={styles.subjectDetailRow}>
            <Text style={styles.label}>Tên môn:</Text>
            <Text style={styles.valueHighlight}>{assignmentParam.tenMH}</Text>
          </View>

          <View style={styles.subjectDetailRow}>
            <Text style={styles.label}>Mã môn học:</Text>
            <View style={styles.codeBadge}>
              <Text style={styles.codeText}>{assignmentParam.maMH}</Text>
            </View>
          </View>
        </View>

        {/* Hạn nộp & Thời hạn */}
        <View style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <View style={[styles.cardIconBox, { backgroundColor: '#FFF3E0' }]}>
              <Ionicons name="calendar" size={18} color="#FF9800" />
            </View>
            <Text style={styles.cardSectionTitle}>Thời hạn nộp bài</Text>
          </View>

          <View style={styles.deadlineRow}>
            <Text style={styles.label}>Hạn chót:</Text>
            <Text style={styles.deadlineValue}>
              {formatDate(assignmentParam.hanNop)}
            </Text>
          </View>

          <View
            style={[
              styles.timeRemainingBox,
              isCompleted
                ? styles.timeBoxCompleted
                : dueInfo.isOverdue
                ? styles.timeBoxOverdue
                : styles.timeBoxPending,
            ]}
          >
            <Ionicons
              name={
                isCompleted
                  ? 'ribbon-outline'
                  : dueInfo.isOverdue
                  ? 'warning-outline'
                  : 'hourglass-outline'
              }
              size={18}
              color={
                isCompleted
                  ? '#4CAF50'
                  : dueInfo.isOverdue
                  ? '#FF6B6B'
                  : '#FF9800'
              }
            />
            <Text
              style={[
                styles.timeRemainingText,
                isCompleted
                  ? styles.textCompleted
                  : dueInfo.isOverdue
                  ? styles.textOverdue
                  : styles.textPending,
              ]}
            >
              {isCompleted ? 'Bài tập đã được đánh dấu hoàn thành' : dueInfo.text}
            </Text>
          </View>
        </View>

        {/* Mô tả chi tiết */}
        <View style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <View style={[styles.cardIconBox, { backgroundColor: '#E8F5E9' }]}>
              <Ionicons name="document-text" size={18} color="#4CAF50" />
            </View>
            <Text style={styles.cardSectionTitle}>Mô tả yêu cầu</Text>
          </View>

          <Text style={styles.descriptionText}>
            {assignmentParam.moTa || 'Không có mô tả chi tiết cho bài tập này.'}
          </Text>
        </View>

        {/* Nút chuyển đổi trạng thái */}
        <TouchableOpacity
          style={[
            styles.actionButton,
            isCompleted ? styles.buttonIncomplete : styles.buttonComplete,
          ]}
          activeOpacity={0.85}
          onPress={handleToggleStatus}
        >
          <Ionicons
            name={isCompleted ? 'arrow-undo' : 'checkmark-done'}
            size={20}
            color="#FFFFFF"
            style={styles.actionButtonIcon}
          />
          <Text style={styles.actionButtonText}>
            {isCompleted
              ? 'Đánh dấu chưa hoàn thành'
              : 'Đánh dấu đã hoàn thành'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
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
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 36,
  },
  headerCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 18,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#EEF2F6',
  },
  statusBadgeRow: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
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
    fontSize: 12,
    fontWeight: '700',
    marginLeft: 5,
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
  mainTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1A2530',
    lineHeight: 28,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 5,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#EEF2F6',
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  cardIconBox: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#EBF4FE',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  cardSectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2D3748',
  },
  subjectDetailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F8FAFC',
  },
  label: {
    fontSize: 14,
    color: '#718096',
  },
  valueHighlight: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A2530',
    flexShrink: 1,
    textAlign: 'right',
  },
  codeBadge: {
    backgroundColor: '#E8F2FD',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  codeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#4A90D9',
  },
  deadlineRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
  },
  deadlineValue: {
    fontSize: 15,
    fontWeight: '700',
    color: '#2D3748',
  },
  timeRemainingBox: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    padding: 10,
    borderRadius: 10,
  },
  timeBoxCompleted: {
    backgroundColor: '#E8F5E9',
  },
  timeBoxPending: {
    backgroundColor: '#FFF8E1',
  },
  timeBoxOverdue: {
    backgroundColor: '#FFEBEE',
  },
  timeRemainingText: {
    fontSize: 13,
    fontWeight: '600',
    marginLeft: 8,
    flexShrink: 1,
  },
  descriptionText: {
    fontSize: 14,
    lineHeight: 22,
    color: '#4A5568',
  },
  actionButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    paddingVertical: 14,
    marginTop: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 3,
  },
  buttonComplete: {
    backgroundColor: '#4CAF50',
  },
  buttonIncomplete: {
    backgroundColor: '#718096',
  },
  actionButtonIcon: {
    marginRight: 8,
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: 'bold',
  },
});

export default AssignmentDetailScreen;
