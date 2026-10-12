import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { studentInfo, subjects, schedule, assignments, grades } from '../data/sampleData';

const TABS = ['Tất cả', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu'];

const ScheduleScreen = ({ navigation }) => {
  // Determine default day from current day of week
  const getDefaultDay = () => {
    const day = new Date().getDay();
    const map = {
      1: 'Thứ Hai',
      2: 'Thứ Ba',
      3: 'Thứ Tư',
      4: 'Thứ Năm',
      5: 'Thứ Sáu',
    };
    return map[day] || 'Thứ Hai';
  };

  const [selectedDay, setSelectedDay] = useState(getDefaultDay);

  // Filter schedule items based on selected tab
  const filteredSchedule = useMemo(() => {
    if (selectedDay === 'Tất cả') {
      return schedule;
    }
    return schedule.filter((item) => item.thu === selectedDay);
  }, [selectedDay]);

  const renderScheduleItem = ({ item }) => {
    return (
      <TouchableOpacity
        style={styles.card}
        activeOpacity={0.8}
        onPress={() => navigation.navigate('ScheduleDetail', { scheduleItem: item })}
      >
        <View style={styles.cardHeader}>
          <View style={styles.dayBadge}>
            <Text style={styles.dayBadgeText}>{item.thu}</Text>
          </View>
          <View style={styles.timeContainer}>
            <Ionicons name="time-outline" size={15} color="#4A90D9" />
            <Text style={styles.timeText}>{item.thoiGian}</Text>
          </View>
        </View>

        <Text style={styles.subjectTitle}>{item.tenMH}</Text>

        <View style={styles.cardDetails}>
          <View style={styles.detailRow}>
            <View style={styles.iconCircle}>
              <Ionicons name="location-outline" size={15} color="#4A90D9" />
            </View>
            <Text style={styles.detailText}>Phòng học: <Text style={styles.detailHighlight}>{item.phongHoc}</Text></Text>
          </View>

          <View style={styles.detailRow}>
            <View style={styles.iconCircle}>
              <Ionicons name="person-outline" size={15} color="#4A90D9" />
            </View>
            <Text style={styles.detailText}>Giảng viên: <Text style={styles.detailHighlight}>{item.giangVien}</Text></Text>
          </View>
        </View>

        <View style={styles.cardFooter}>
          <Text style={styles.viewDetailText}>Xem chi tiết</Text>
          <Ionicons name="chevron-forward" size={16} color="#4A90D9" />
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#4A90D9" />
      <View style={styles.container}>
        {/* Header Title */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Thời khóa biểu</Text>
          <Text style={styles.headerSubtitle}>Lịch học các môn trong tuần</Text>
        </View>

        {/* Day Filter Tabs */}
        <View style={styles.tabsWrapper}>
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={TABS}
            keyExtractor={(item) => item}
            contentContainerStyle={styles.tabsContainer}
            renderItem={({ item }) => {
              const isSelected = selectedDay === item;
              return (
                <TouchableOpacity
                  style={[styles.tabButton, isSelected && styles.tabButtonActive]}
                  onPress={() => setSelectedDay(item)}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.tabText, isSelected && styles.tabTextActive]}>
                    {item}
                  </Text>
                </TouchableOpacity>
              );
            }}
          />
        </View>

        {/* Schedule List */}
        <FlatList
          data={filteredSchedule}
          keyExtractor={(item) => item.id}
          renderItem={renderScheduleItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="calendar-outline" size={60} color="#BDC3C7" />
              <Text style={styles.emptyTitle}>Không có lịch học</Text>
              <Text style={styles.emptySubtitle}>
                {selectedDay === 'Tất cả'
                  ? 'Hiện chưa có lịch học nào trong hệ thống.'
                  : `Bạn không có tiết học nào vào ${selectedDay}.`}
              </Text>
            </View>
          }
        />
      </View>
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
  header: {
    backgroundColor: '#4A90D9',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 16,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  headerSubtitle: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.85)',
    marginTop: 2,
  },
  tabsWrapper: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E8ECEF',
  },
  tabsContainer: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 8,
  },
  tabButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F0F2F5',
    marginRight: 6,
  },
  tabButtonActive: {
    backgroundColor: '#4A90D9',
  },
  tabText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#666666',
  },
  tabTextActive: {
    color: '#FFFFFF',
  },
  listContent: {
    padding: 16,
    paddingBottom: 24,
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
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  dayBadge: {
    backgroundColor: 'rgba(74, 144, 217, 0.12)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  dayBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#4A90D9',
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#4A90D9',
    marginLeft: 4,
  },
  subjectTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#2C3E50',
    marginBottom: 12,
  },
  cardDetails: {
    backgroundColor: '#F8F9FA',
    borderRadius: 10,
    padding: 12,
    gap: 8,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: 'rgba(74, 144, 217, 0.12)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  detailText: {
    fontSize: 13,
    color: '#666666',
  },
  detailHighlight: {
    fontWeight: '600',
    color: '#2C3E50',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F0F2F5',
  },
  viewDetailText: {
    fontSize: 13,
    color: '#4A90D9',
    fontWeight: '600',
    marginRight: 2,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 20,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2C3E50',
    marginTop: 12,
  },
  emptySubtitle: {
    fontSize: 13,
    color: '#7F8C8D',
    textAlign: 'center',
    marginTop: 6,
  },
});

export default ScheduleScreen;
