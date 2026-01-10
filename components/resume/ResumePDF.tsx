import { Document, Page, Text, View, StyleSheet, Font, Link } from '@react-pdf/renderer';
import { Resume } from '@/types/resume';

// Register fonts (optional - using default fonts for now)
// Font.register({ family: 'Helvetica', src: ... });

const styles = StyleSheet.create({
    page: {
        padding: 30, // Reduced from 40 for better space usage
        fontSize: 10, // Standard ATS-friendly font size
        fontFamily: 'Helvetica',
        lineHeight: 1.4, // Slightly tighter line height
    },
    header: {
        marginBottom: 8,
        textAlign: 'center',
    },
    name: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 3,
        textTransform: 'uppercase', // Adds a bit more professional feel
    },
    contactInfo: {
        fontSize: 9,
        color: '#333',
    },
    section: {
        marginTop: 10, // Reduced from 12
        marginBottom: 4, // Reduced from 8
    },
    sectionTitle: {
        fontSize: 11, // Reduced for hierarchy balance
        fontWeight: 'bold',
        marginBottom: 4,
        borderBottomWidth: 1,
        borderBottomColor: '#000',
        borderBottomStyle: 'solid',
        paddingBottom: 1,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    entryContainer: {
        marginBottom: 5, // Reduced from 8
    },
    entryHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 1,
    },
    entryTitle: {
        fontSize: 10,
        fontWeight: 'bold',
    },
    entrySubtitle: {
        fontSize: 9,
        color: '#444',
        marginBottom: 1,
        fontWeight: 'bold', // Added bold for better distinction
    },
    entryDate: {
        fontSize: 9,
        color: '#666',
    },
    bulletList: {
        marginLeft: 12, // Reduced indent
        marginTop: 1,
    },
    bulletItem: {
        flexDirection: 'row',
        marginBottom: 1, // Tighter bullet spacing
    },
    bullet: {
        width: 8,
        fontSize: 9,
    },
    bulletText: {
        flex: 1,
        fontSize: 9,
        lineHeight: 1.3,
    },
    skillsContainer: {
        marginBottom: 2,
    },
    skillCategory: {
        fontSize: 9,
        fontWeight: 'bold',
    },
    skillsList: {
        fontSize: 9,
        marginLeft: 5,
    },
    link: {
        color: '#0066cc',
        textDecoration: 'none',
    },
});

interface ResumePDFProps {
    resume: Resume;
}

export const ResumePDF = ({ resume }: ResumePDFProps) => (
    <Document>
        <Page size="A4" style={styles.page}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.name}>{resume.basics.name}</Text>
                <Text style={styles.contactInfo}>
                    {resume.basics.location} | {resume.basics.email} | {resume.basics.phone}
                </Text>
                {resume.basics.url && (
                    <Link src={resume.basics.url} style={[styles.contactInfo, styles.link]}>
                        {resume.basics.url.replace(/^https?:\/\//, '')}
                    </Link>
                )}
                {/* Custom Fields (Additional Links) */}
                {resume.basics.customFields && resume.basics.customFields.length > 0 && (
                    <View style={{ flexDirection: 'row', justifyContent: 'center', flexWrap: 'wrap', marginTop: 2 }}>
                        {resume.basics.customFields.map((field) => (
                            field.value ? (
                                <View key={field.id} style={{ flexDirection: 'row', alignItems: 'center', marginHorizontal: 6 }}>
                                    <Text style={[styles.contactInfo, { marginRight: 2 }]}>
                                        {field.name ? `${field.name}:` : ''}
                                    </Text>
                                    <Link src={field.value} style={[styles.contactInfo, styles.link]}>
                                        {field.value.replace(/^https?:\/\//, '')}
                                    </Link>
                                </View>
                            ) : null
                        ))}
                    </View>
                )}
            </View>

            {/* Professional Summary */}
            {resume.basics.summary && (
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>PROFESSIONAL SUMMARY</Text>
                    <Text style={{ fontSize: 10, lineHeight: 1.4 }}>{resume.basics.summary}</Text>
                </View>
            )}

            {/* Work Experience */}
            {resume.work.length > 0 && (
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>EXPERIENCE</Text>
                    {resume.work.map((job) => (
                        <View key={job.id} style={styles.entryContainer}>
                            <View style={styles.entryHeader}>
                                <Text style={styles.entryTitle}>{job.position}</Text>
                                <Text style={styles.entryDate}>
                                    {job.startDate} — {job.endDate}
                                </Text>
                            </View>
                            <Text style={styles.entrySubtitle}>{job.company}</Text>
                            {job.highlights.length > 0 && (
                                <View style={styles.bulletList}>
                                    {job.highlights.map((highlight, index) => (
                                        <View key={index} style={styles.bulletItem}>
                                            <Text style={styles.bullet}>•</Text>
                                            <Text style={styles.bulletText}>{highlight}</Text>
                                        </View>
                                    ))}
                                </View>
                            )}
                        </View>
                    ))}
                </View>
            )}

            {/* Education */}
            {resume.education.length > 0 && (
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>EDUCATION</Text>
                    {resume.education.map((edu) => (
                        <View key={edu.id} style={styles.entryContainer}>
                            <View style={styles.entryHeader}>
                                <Text style={styles.entryTitle}>
                                    {edu.degree} in {edu.field}
                                </Text>
                                <Text style={styles.entryDate}>
                                    {edu.startDate} — {edu.endDate}
                                </Text>
                            </View>
                            <Text style={styles.entrySubtitle}>
                                {edu.institution}, {edu.location}
                            </Text>
                            {edu.gpa && <Text style={{ fontSize: 10 }}>GPA: {edu.gpa}</Text>}
                        </View>
                    ))}
                </View>
            )}

            {/* Technical Skills */}
            {resume.skills.length > 0 && (
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>TECHNICAL SKILLS</Text>
                    {resume.skills.map((skill) => (
                        <View key={skill.id} style={styles.skillsContainer}>
                            <Text>
                                <Text style={styles.skillCategory}>{skill.category}: </Text>
                                <Text style={styles.skillsList}>{skill.skills.join(', ')}</Text>
                            </Text>
                        </View>
                    ))}
                </View>
            )}

            {/* Projects */}
            {resume.projects.length > 0 && (
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>PROJECTS</Text>
                    {resume.projects.map((project) => (
                        <View key={project.id} style={styles.entryContainer}>
                            <View style={styles.entryHeader}>
                                <Text style={styles.entryTitle}>{project.name}</Text>
                                <Text style={styles.entryDate}>{project.date}</Text>
                            </View>
                            {project.description && (
                                <Text style={styles.entrySubtitle}>{project.description}</Text>
                            )}
                            {project.technologies && project.technologies.length > 0 && (
                                <Text style={{ fontSize: 9, fontStyle: 'italic', marginBottom: 2 }}>
                                    <Text style={{ fontWeight: 'bold' }}>Tech Stack:</Text> {project.technologies.join(', ')}
                                </Text>
                            )}
                            {project.highlights.length > 0 && (
                                <View style={styles.bulletList}>
                                    {project.highlights.map((highlight, index) => (
                                        <View key={index} style={styles.bulletItem}>
                                            <Text style={styles.bullet}>•</Text>
                                            <Text style={styles.bulletText}>{highlight}</Text>
                                        </View>
                                    ))}
                                </View>
                            )}
                        </View>
                    ))}
                </View>
            )}

            {/* Certifications */}
            {resume.certifications.length > 0 && (
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>CERTIFICATIONS</Text>
                    <View style={styles.bulletList}>
                        {resume.certifications.map((cert) => (
                            <View key={cert.id} style={styles.bulletItem}>
                                <Text style={styles.bullet}>•</Text>
                                <Text style={styles.bulletText}>
                                    {cert.url ? (
                                        <Link src={cert.url} style={styles.link}>{cert.name}</Link>
                                    ) : (
                                        <Text>{cert.name}</Text>
                                    )}
                                    {cert.issuer && ` — ${cert.issuer}`}
                                    {cert.date && ` (${cert.date})`}
                                </Text>
                            </View>
                        ))}
                    </View>
                </View>
            )}
        </Page>
    </Document>
);
