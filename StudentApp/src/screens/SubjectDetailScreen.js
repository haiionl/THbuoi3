import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { studentInfo, subjects, schedule, assignments, grades } from '../data/sampleData';

const SubjectDetailScreen = ({ route, navigation }) => {
  const subject = route?.params?.subject || {};

  // Filter related schedules by subject code
  const relatedSchedules = schedule.filter(
    (item) => item.maMH === subject.maMH
  );

  // Filter related assignments by subject code
  const relatedAssignments = assignments.filter(
    (item) => item.maMH === subject.maMH
  );

  // Format date helper (YYYY-MM-DD to DD/MM/YYYY)
  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      return `${parts[2]}/${parts[1]}/${parts[0]}`;
    }
    return dateStr;
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#4A90D9" />
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Header & Main Info Card */}
        <View style={styles.mainCard}>
          <View style={styles.badgeRow}>
            <View style={styles.codeBadge}>
              <Text style={styles.codeBadgeText}>{subject.maMH || 'N/A'}</Text>
            </View>
            <View style={styles.creditsBadge}>
              <Ionicons name="ribbon-outline" size={13} color="#4A90D9" />
              <Text style={styles.creditsBadgeText}>{subject.soTinChi || 0} tín chỉ</Text>
            </View>
          </View>

          <Text style={styles.title}>{subject.tenMH || 'Chi tiết môn học'}</Text>

          {/* Progress Section */}
          <View style={styles.progressContainer}>
            <View style={styles.progressLabelRow}>
              <Text style={styles.progressTitle}>Tiến độ học tập</Text>
              <Text style={styles.progressPercentage}>{subject.tienDo || 0}%</Text>
            </View>
            <View style={styles.progressBarBackground}>
              <View
                style={[
                  styles.progressBarFill,
                  { width: `${Math.min(subject.tienDo || 0, 100)}%` },
                ]}
              />
            </View>
          </View>

          {/* Lecturer */}
          <View style={styles.lecturerRow}>
            <View style={styles.lecturerIconCircle}>
              <Ionicons name="person-outline" size={16} color="#4A90D9" />
            </View>
            <View style={styles.lecturerInfo}>
              <Text style={styles.lecturerLabel}>Giảng viên phụ trách</Text>
              <Text style={styles.lecturerName}>{subject.giangVien || 'Chưa cập nhật'}</Text>
            </View>
          </View>

          {/* Description */}
          {subject.moTa ? (
            <View style={styles.descriptionSection}>
              <Text style={styles.descriptionLabel}>Mô tả môn học</Text>
              <Text style={styles.descriptionText}>{subject.moTa}</Text>
            </View>
          ) : null}
        </View>

        {/* Related Schedules Section */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Ionicons name="time-outline" size={20} color="#4A90D9" />
            <Text style={styles.sectionTitle}>Lịch học môn này</Text>
            <Text style={styles.sectionCount}>({relatedSchedules.length})</Text>
          </View>

          {relatedSchedules.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="calendar-outline" size={32} color="#BDC3C7" />
              <Text style={styles.emptyText}>Chưa có lịch học cho môn này</Text>
            </View>
          ) : (
            relatedSchedules.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.scheduleItem}
                activeOpacity={0.7}
                onPress={() => navigation.navigate('ScheduleDetail', { scheduleItem: item })}
              >
                <View style={styles.scheduleHeaderRow}>
                  <View style={styles.scheduleDayBadge}>
                    <Text style={styles.scheduleDayText}>{item.thu}</Text>
                  </View>
                  <Text style={styles.scheduleTime}>{item.thoiGian}</Text>
                </View>

                <View style={styles.scheduleMetaRow}>
                  <View style={styles.scheduleMetaItem}>
                    <Ionicons name="location-outline" size={14} color="#666666" />
                    <Text style={styles.scheduleMetaText}>Phòng: {item.phongHoc}</Text>
                  </View>
                  {item.ghiChu ? (
                    <View style={styles.scheduleMetaItem}>
                      <Ionicons name="alert-circle-outline" size={14} color="#E67E22" />
                      <Text style={styles.scheduleNoteText}>{item.ghiChu}</Text>
                    </View>
                  ) : null}
                </View>
              </TouchableOpacity>
            ))
          )}
        </View>

        {/* Related Assignments Section */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Ionicons name="clipboard-outline" size={20} color="#4A90D9" />
            <Text style={styles.sectionTitle}>Danh sách bài tập</Text>
            <Text style={styles.sectionCount}>({relatedAssignments.length})</Text>
          </View>

          {relatedAssignments.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="document-text-outline" size={32} color="#BDC3C7" />
              <Text style={styles.emptyText}>Chưa có bài tập nào cho môn này</Text>
            </View>
          ) : (
            relatedAssignments.map((assignment) => (
              <TouchableOpacity
                key={assignment.id}
                style={styles.assignmentItem}
                activeOpacity={0.7}
                onPress={() => {
                  if (navigation.navigate) {
                    navigation.navigate('AssignmentDetail', { assignment });
                  }
                }}
              >
                <View style={styles.assignmentHeaderRow}>
                  <Text style={styles.assignmentTitle} numberOfLines={1}>
                    {assignment.tieuDe}
                  </Text>
                  <View
                    style={[
                      styles.statusBadge,
                      assignment.hoangThanh ? styles.statusDone : styles.statusPending,
                    ]}
                  >
                    <Text
                      style={[
                        styles.statusText,
                        assignment.hoangThanh ? styles.statusDoneText : styles.statusPendingText,
                      ]}
                    >
                      {assignment.hoangThanh ? 'Đã nộp' : 'Chưa nộp'}
                    </Text>
                  </View>
                </View>

                {assignment.moTa ? (
                  <Text style={styles.assignmentDescription} numberOfLines={2}>
                    {assignment.moTa}
                  </Text>
                ) : null}

                <View style={styles.assignmentFooter}>
                  <Ionicons name="calendar-outline" size={13} color="#7F8C8D" />
                  <Text style={styles.assignmentDueDate}>
                    Hạn nộp: {formatDate(assignment.hanNop)}
                  </Text>
                </View>
              </TouchableOpacity>
            ))
          )}
        </View>
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
    backgroundColor: '#F5F7FA',
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 32,
  },
  mainCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 3,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    gap: 8,
  },
  codeBadge: {
    backgroundColor: 'rgba(74, 144, 217, 0.12)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  codeBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#4A90D9',
  },
  creditsBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F4F8',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
  },
  creditsBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4A90D9',
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#2C3E50',
    marginBottom: 16,
  },
  progressContainer: {
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
  },
  progressLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressTitle: {
    fontSize: 13,
    color: '#666666',
    fontWeight: '500',
  },
  progressPercentage: {
    fontSize: 15,
    fontWeight: '700',
    color: '#4A90D9',
  },
  progressBarBackground: {
    height: 8,
    backgroundColor: '#EAECEF',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#4A90D9',
    borderRadius: 4,
  },
  lecturerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
    paddingVertical: 4,
  },
  lecturerIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(74, 144, 217, 0.12)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  lecturerInfo: {
    flex: 1,
  },
  lecturerLabel: {
    fontSize: 11,
    color: '#7F8C8D',
  },
  lecturerName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#2C3E50',
  },
  descriptionSection: {
    borderTopWidth: 1,
    borderTopColor: '#F0F2F5',
    paddingTop: 12,
  },
  descriptionLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 4,
  },
  descriptionText: {
    fontSize: 13,
    color: '#555555',
    lineHeight: 20,
  },
  sectionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 18,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 3,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2C3E50',
    marginLeft: 8,
  },
  sectionCount: {
    fontSize: 14,
    color: '#7F8C8D',
    marginLeft: 6,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  emptyText: {
    marginTop: 8,
    fontSize: 13,
    color: '#95A5A6',
  },
  scheduleItem: {
    backgroundColor: '#F8F9FA',
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#4A90D9',
  },
  scheduleHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  scheduleDayBadge: {
    backgroundColor: 'rgba(74, 144, 217, 0.12)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  scheduleDayText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4A90D9',
  },
  scheduleTime: {
    fontSize: 13,
    fontWeight: '600',
    color: '#2C3E50',
  },
  scheduleMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flexWrap: 'wrap',
  },
  scheduleMetaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  scheduleMetaText: {
    fontSize: 12,
    color: '#555555',
  },
  scheduleNoteText: {
    fontSize: 12,
    color: '#E67E22',
  },
  assignmentItem: {
    backgroundColor: '#F8F9FA',
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
  },
  assignmentHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  assignmentTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2C3E50',
    flex: 1,
    marginRight: 8,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  statusDone: {
    backgroundColor: 'rgba(46, 204, 113, 0.15)',
  },
  statusDoneText: {
    color: '#27AE60',
    fontSize: 11,
    fontWeight: '600',
  },
  statusPending: {
    backgroundColor: 'rgba(231, 76, 60, 0.12)',
  },
  statusPendingText: {
    color: '#E74C3C',
    fontSize: 11,
    fontWeight: '600',
  },
  assignmentDescription: {
    fontSize: 12,
    color: '#666666',
    lineHeight: 18,
    marginBottom: 8,
  },
  assignmentFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  assignmentDueDate: {
    fontSize: 12,
    color: '#7F8C8D',
  },
});

export default SubjectDetailScreen;
