import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { studentInfo, subjects, schedule, assignments, grades } from '../data/sampleData';

const HomeScreen = ({ navigation }) => {
  // Format current date in Vietnamese
  const getCurrentDate = () => {
    const today = new Date();
    const days = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];
    const dayName = days[today.getDay()];
    const date = today.getDate().toString().padStart(2, '0');
    const month = (today.getMonth() + 1).toString().padStart(2, '0');
    const year = today.getFullYear();
    return `${dayName}, ${date}/${month}/${year}`;
  };

  // Format date string YYYY-MM-DD to DD/MM/YYYY
  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      return `${parts[2]}/${parts[1]}/${parts[0]}`;
    }
    return dateStr;
  };

  // Calculate days remaining from today to hanNop
  const getDaysRemaining = (dateStr) => {
    if (!dateStr) return '';
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dueDate = new Date(dateStr);
    dueDate.setHours(0, 0, 0, 0);
    const diffTime = dueDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return `Quá hạn ${Math.abs(diffDays)} ngày`;
    } else if (diffDays === 0) {
      return 'Hạn nộp hôm nay';
    } else {
      return `Còn ${diffDays} ngày`;
    }
  };

  // First 4 subjects
  const currentSubjects = subjects.slice(0, 4);

  // Filter uncompleted assignments, sorted ascending by hanNop, take first 3
  const upcomingAssignments = [...assignments]
    .filter((item) => item.hoangThanh === false)
    .sort((a, b) => new Date(a.hanNop) - new Date(b.hanNop))
    .slice(0, 3);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#4A90D9" />
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Section */}
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <View>
              <Text style={styles.dateText}>{getCurrentDate()}</Text>
              <Text style={styles.welcomeText}>Xin chào,</Text>
              <Text style={styles.studentName}>{studentInfo.hoTen}</Text>
              <Text style={styles.studentId}>MSSV: {studentInfo.maSV}</Text>
            </View>
            <View style={styles.avatarContainer}>
              <Ionicons name="person-circle" size={54} color="#FFFFFF" />
            </View>
          </View>
        </View>

        {/* Subjects Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleRow}>
              <Ionicons name="book-outline" size={20} color="#4A90D9" />
              <Text style={styles.sectionTitle}>Môn học hiện tại</Text>
            </View>
            <Text style={styles.sectionSubtitle}>({currentSubjects.length} môn)</Text>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.subjectList}
          >
            {currentSubjects.map((subject) => (
              <TouchableOpacity
                key={subject.id}
                style={styles.subjectCard}
                activeOpacity={0.8}
                onPress={() => navigation.navigate('SubjectDetail', { subject })}
              >
                <View style={styles.subjectCodeBadge}>
                  <Text style={styles.subjectCodeText}>{subject.maMH}</Text>
                </View>
                <Text style={styles.subjectName} numberOfLines={2}>
                  {subject.tenMH}
                </Text>
                <View style={styles.creditsRow}>
                  <Ionicons name="ribbon-outline" size={14} color="#666666" />
                  <Text style={styles.creditsText}>{subject.soTinChi} tín chỉ</Text>
                </View>

                {/* Progress bar */}
                <View style={styles.progressContainer}>
                  <View style={styles.progressLabelRow}>
                    <Text style={styles.progressLabel}>Tiến độ</Text>
                    <Text style={styles.progressValue}>{subject.tienDo}%</Text>
                  </View>
                  <View style={styles.progressBarBackground}>
                    <View
                      style={[
                        styles.progressBarFill,
                        { width: `${Math.min(subject.tienDo, 100)}%` },
                      ]}
                    />
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Upcoming Assignments Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleRow}>
              <Ionicons name="clipboard-outline" size={20} color="#FF6B6B" />
              <Text style={styles.sectionTitle}>Bài tập sắp tới</Text>
            </View>
            <Text style={styles.sectionSubtitle}>({upcomingAssignments.length} bài)</Text>
          </View>

          {upcomingAssignments.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Ionicons name="checkmark-circle-outline" size={40} color="#4A90D9" />
              <Text style={styles.emptyText}>Tuyệt vời! Không có bài tập nào cần hoàn thành.</Text>
            </View>
          ) : (
            upcomingAssignments.map((assignment) => (
              <TouchableOpacity
                key={assignment.id}
                style={styles.assignmentCard}
                activeOpacity={0.8}
                onPress={() => navigation.navigate('AssignmentDetail', { assignment })}
              >
                <View style={styles.assignmentHeaderRow}>
                  <View style={styles.assignmentIconWrap}>
                    <Ionicons name="document-text-outline" size={22} color="#4A90D9" />
                  </View>
                  <View style={styles.assignmentTitleContainer}>
                    <Text style={styles.assignmentTitle} numberOfLines={1}>
                      {assignment.tieuDe}
                    </Text>
                    <Text style={styles.assignmentSubject}>{assignment.tenMH}</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={18} color="#999999" />
                </View>

                <View style={styles.assignmentFooter}>
                  <View style={styles.dueDateRow}>
                    <Ionicons name="calendar-outline" size={14} color="#777777" />
                    <Text style={styles.dueDateText}>Hạn nộp: {formatDate(assignment.hanNop)}</Text>
                  </View>
                  <View style={styles.daysRemainingBadge}>
                    <Ionicons name="time-outline" size={12} color="#FF6B6B" />
                    <Text style={styles.daysRemainingText}>
                      {getDaysRemaining(assignment.hanNop)}
                    </Text>
                  </View>
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
    backgroundColor: '#4A90D9',
  },
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  contentContainer: {
    paddingBottom: 24,
  },
  header: {
    backgroundColor: '#4A90D9',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 24,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dateText: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.85)',
    marginBottom: 4,
  },
  welcomeText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '400',
  },
  studentName: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FFFFFF',
    marginTop: 2,
  },
  studentId: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.9)',
    marginTop: 2,
  },
  avatarContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  section: {
    marginTop: 20,
    paddingHorizontal: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#2C3E50',
    marginLeft: 6,
  },
  sectionSubtitle: {
    fontSize: 13,
    color: '#7F8C8D',
  },
  subjectList: {
    paddingVertical: 4,
    gap: 12,
  },
  subjectCard: {
    width: 200,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    marginRight: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  subjectCodeBadge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(74, 144, 217, 0.12)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    marginBottom: 8,
  },
  subjectCodeText: {
    color: '#4A90D9',
    fontSize: 11,
    fontWeight: '700',
  },
  subjectName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#2C3E50',
    minHeight: 40,
    lineHeight: 20,
  },
  creditsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    marginBottom: 12,
  },
  creditsText: {
    fontSize: 12,
    color: '#666666',
    marginLeft: 4,
  },
  progressContainer: {
    marginTop: 'auto',
  },
  progressLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  progressLabel: {
    fontSize: 11,
    color: '#888888',
  },
  progressValue: {
    fontSize: 11,
    fontWeight: '600',
    color: '#4A90D9',
  },
  progressBarBackground: {
    height: 6,
    backgroundColor: '#EAECEF',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#4A90D9',
    borderRadius: 3,
  },
  assignmentCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 5,
    elevation: 2,
  },
  assignmentHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  assignmentIconWrap: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: 'rgba(74, 144, 217, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  assignmentTitleContainer: {
    flex: 1,
  },
  assignmentTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#2C3E50',
  },
  assignmentSubject: {
    fontSize: 12,
    color: '#7F8C8D',
    marginTop: 2,
  },
  assignmentFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F0F2F5',
  },
  dueDateRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dueDateText: {
    fontSize: 12,
    color: '#777777',
    marginLeft: 4,
  },
  daysRemainingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF0F0',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  daysRemainingText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#FF6B6B',
    marginLeft: 3,
  },
  emptyContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    marginTop: 8,
    fontSize: 13,
    color: '#7F8C8D',
    textAlign: 'center',
  },
});

export default HomeScreen;
