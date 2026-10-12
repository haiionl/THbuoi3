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

const GradeDetailScreen = ({ route, navigation }) => {
  const grade = route?.params?.grade || {};

  const getScoreInfo = (score) => {
    if (score === null || score === undefined) {
      return { text: 'Chưa có', color: '#8E8E93', bg: '#F2F2F7', rank: 'Chưa có' };
    }
    if (score >= 8.5) {
      return { text: score.toFixed(1), color: '#2ECC71', bg: '#E8F8F0', rank: 'Giỏi / Xuất sắc' };
    }
    if (score >= 7.0) {
      return { text: score.toFixed(1), color: '#4A90D9', bg: '#EBF4FF', rank: 'Khá' };
    }
    if (score >= 5.0) {
      return { text: score.toFixed(1), color: '#F39C12', bg: '#FEF3C7', rank: 'Trung bình' };
    }
    return { text: score.toFixed(1), color: '#E74C3C', bg: '#FEE2E2', rank: 'Yếu / Kém' };
  };

  const quaTrinhInfo = getScoreInfo(grade.diemQuaTrinh);
  const giuaKyInfo = getScoreInfo(grade.diemGiuaKy);
  const cuoiKyInfo = getScoreInfo(grade.diemCuoiKy);
  const tongKetInfo = getScoreInfo(grade.diemTongKet);

  // Tìm thông tin chi tiết môn học từ subjects nếu có
  const matchedSubject = subjects.find((s) => s.maMH === grade.maMH);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#F5F7FA" />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header môn học */}
        <View style={styles.headerCard}>
          <View style={styles.badgeRow}>
            <View style={styles.codeBadge}>
              <Ionicons name="bookmark-outline" size={13} color="#4A90D9" style={{ marginRight: 4 }} />
              <Text style={styles.codeText}>{grade.maMH || 'N/A'}</Text>
            </View>
            <View
              style={[
                styles.statusBadge,
                grade.trangThai === 'Hoàn thành'
                  ? styles.statusCompleted
                  : styles.statusInProgress,
              ]}
            >
              <Text
                style={[
                  styles.statusBadgeText,
                  grade.trangThai === 'Hoàn thành'
                    ? styles.statusCompletedText
                    : styles.statusInProgressText,
                ]}
              >
                {grade.trangThai || 'Đang học'}
              </Text>
            </View>
          </View>

          <Text style={styles.subjectTitle}>{grade.tenMH || 'Chi tiết điểm'}</Text>

          {matchedSubject && (
            <View style={styles.metaRow}>
              <View style={styles.metaItem}>
                <Ionicons name="ribbon-outline" size={15} color="#718096" />
                <Text style={styles.metaText}>{matchedSubject.soTinChi} tín chỉ</Text>
              </View>
              <View style={styles.metaItem}>
                <Ionicons name="person-outline" size={15} color="#718096" />
                <Text style={styles.metaText}>{matchedSubject.giangVien}</Text>
              </View>
            </View>
          )}
        </View>

        {/* Điểm tổng kết nổi bật */}
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Điểm tổng kết học phần</Text>
          <View
            style={[
              styles.summaryScoreCircle,
              { borderColor: tongKetInfo.color, backgroundColor: tongKetInfo.bg },
            ]}
          >
            <Text style={[styles.summaryScoreText, { color: tongKetInfo.color }]}>
              {tongKetInfo.text}
            </Text>
          </View>
          <Text style={[styles.summaryRank, { color: tongKetInfo.color }]}>
            {tongKetInfo.rank}
          </Text>
          <Text style={styles.summaryNote}>
            {grade.diemTongKet !== null && grade.diemTongKet !== undefined
              ? 'Điểm tổng kết đã được tính vào bảng điểm tích lũy'
              : 'Điểm đang trong quá trình cập nhật đánh giá cuối kỳ'}
          </Text>
        </View>

        {/* Danh sách các điểm thành phần */}
        <View style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <Ionicons name="stats-chart-outline" size={18} color="#4A90D9" />
            <Text style={styles.cardHeaderTitle}>Điểm các thành phần</Text>
          </View>

          <View style={styles.divider} />

          {/* Điểm quá trình */}
          <View style={styles.scoreRow}>
            <View style={styles.scoreRowLeft}>
              <View style={[styles.indicatorDot, { backgroundColor: quaTrinhInfo.color }]} />
              <View>
                <Text style={styles.scoreItemName}>Điểm quá trình (chuyên cần/BT)</Text>
                <Text style={styles.scoreItemWeight}>Trọng số: 20%</Text>
              </View>
            </View>
            <View style={[styles.scoreBadge, { backgroundColor: quaTrinhInfo.bg }]}>
              <Text style={[styles.scoreBadgeText, { color: quaTrinhInfo.color }]}>
                {quaTrinhInfo.text}
              </Text>
            </View>
          </View>

          {/* Điểm giữa kỳ */}
          <View style={styles.scoreRow}>
            <View style={styles.scoreRowLeft}>
              <View style={[styles.indicatorDot, { backgroundColor: giuaKyInfo.color }]} />
              <View>
                <Text style={styles.scoreItemName}>Điểm thi giữa kỳ</Text>
                <Text style={styles.scoreItemWeight}>Trọng số: 30%</Text>
              </View>
            </View>
            <View style={[styles.scoreBadge, { backgroundColor: giuaKyInfo.bg }]}>
              <Text style={[styles.scoreBadgeText, { color: giuaKyInfo.color }]}>
                {giuaKyInfo.text}
              </Text>
            </View>
          </View>

          {/* Điểm cuối kỳ */}
          <View style={styles.scoreRow}>
            <View style={styles.scoreRowLeft}>
              <View style={[styles.indicatorDot, { backgroundColor: cuoiKyInfo.color }]} />
              <View>
                <Text style={styles.scoreItemName}>Điểm thi cuối kỳ</Text>
                <Text style={styles.scoreItemWeight}>Trọng số: 50%</Text>
              </View>
            </View>
            <View style={[styles.scoreBadge, { backgroundColor: cuoiKyInfo.bg }]}>
              <Text style={[styles.scoreBadgeText, { color: cuoiKyInfo.color }]}>
                {cuoiKyInfo.text}
              </Text>
            </View>
          </View>
        </View>

        {/* Thanh trực quan so sánh điểm */}
        <View style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <Ionicons name="bar-chart-outline" size={18} color="#4A90D9" />
            <Text style={styles.cardHeaderTitle}>Thang điểm trực quan (hệ 10)</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.visualBarItem}>
            <View style={styles.visualBarHeader}>
              <Text style={styles.visualBarLabel}>Quá trình</Text>
              <Text style={styles.visualBarValue}>{quaTrinhInfo.text}</Text>
            </View>
            <View style={styles.visualBarBg}>
              <View
                style={[
                  styles.visualBarFill,
                  {
                    width: `${grade.diemQuaTrinh ? Math.min(grade.diemQuaTrinh * 10, 100) : 0}%`,
                    backgroundColor: quaTrinhInfo.color,
                  },
                ]}
              />
            </View>
          </View>

          <View style={styles.visualBarItem}>
            <View style={styles.visualBarHeader}>
              <Text style={styles.visualBarLabel}>Giữa kỳ</Text>
              <Text style={styles.visualBarValue}>{giuaKyInfo.text}</Text>
            </View>
            <View style={styles.visualBarBg}>
              <View
                style={[
                  styles.visualBarFill,
                  {
                    width: `${grade.diemGiuaKy ? Math.min(grade.diemGiuaKy * 10, 100) : 0}%`,
                    backgroundColor: giuaKyInfo.color,
                  },
                ]}
              />
            </View>
          </View>

          <View style={styles.visualBarItem}>
            <View style={styles.visualBarHeader}>
              <Text style={styles.visualBarLabel}>Cuối kỳ</Text>
              <Text style={styles.visualBarValue}>{cuoiKyInfo.text}</Text>
            </View>
            <View style={styles.visualBarBg}>
              <View
                style={[
                  styles.visualBarFill,
                  {
                    width: `${grade.diemCuoiKy ? Math.min(grade.diemCuoiKy * 10, 100) : 0}%`,
                    backgroundColor: cuoiKyInfo.color,
                  },
                ]}
              />
            </View>
          </View>
        </View>

        {/* Nút quay lại */}
        <TouchableOpacity
          style={styles.backButton}
          activeOpacity={0.8}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={18} color="#4A90D9" style={{ marginRight: 6 }} />
          <Text style={styles.backButtonText}>Quay lại danh sách điểm</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default GradeDetailScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 32,
  },
  headerCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  badgeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  codeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EBF4FF',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  codeText: {
    color: '#4A90D9',
    fontSize: 13,
    fontWeight: '700',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusCompleted: {
    backgroundColor: '#E8F8F0',
  },
  statusCompletedText: {
    color: '#27AE60',
    fontSize: 12,
    fontWeight: '600',
  },
  statusInProgress: {
    backgroundColor: '#FEF3C7',
  },
  statusInProgressText: {
    color: '#D97706',
    fontSize: 12,
    fontWeight: '600',
  },
  subjectTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1A202C',
    lineHeight: 30,
    marginBottom: 12,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#EDF2F7',
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaText: {
    fontSize: 13,
    color: '#718096',
    marginLeft: 5,
  },
  summaryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  summaryTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#718096',
    marginBottom: 16,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  summaryScoreCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 3,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  summaryScoreText: {
    fontSize: 28,
    fontWeight: '800',
  },
  summaryRank: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 6,
  },
  summaryNote: {
    fontSize: 12,
    color: '#A0AEC0',
    textAlign: 'center',
    paddingHorizontal: 12,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardHeaderTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A202C',
    marginLeft: 8,
  },
  divider: {
    height: 1,
    backgroundColor: '#EDF2F7',
    marginBottom: 14,
  },
  scoreRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F7FAFC',
  },
  scoreRowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  indicatorDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 10,
  },
  scoreItemName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2D3748',
  },
  scoreItemWeight: {
    fontSize: 12,
    color: '#718096',
    marginTop: 2,
  },
  scoreBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    minWidth: 64,
    alignItems: 'center',
  },
  scoreBadgeText: {
    fontSize: 14,
    fontWeight: '700',
  },
  visualBarItem: {
    marginBottom: 14,
  },
  visualBarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  visualBarLabel: {
    fontSize: 13,
    color: '#4A5568',
    fontWeight: '500',
  },
  visualBarValue: {
    fontSize: 13,
    color: '#2D3748',
    fontWeight: '700',
  },
  visualBarBg: {
    height: 8,
    backgroundColor: '#EDF2F7',
    borderRadius: 4,
    overflow: 'hidden',
  },
  visualBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  backButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#4A90D9',
    borderRadius: 12,
    paddingVertical: 12,
    marginTop: 4,
  },
  backButtonText: {
    color: '#4A90D9',
    fontSize: 15,
    fontWeight: '600',
  },
});
