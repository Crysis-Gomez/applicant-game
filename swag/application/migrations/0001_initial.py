# -*- coding: utf-8 -*-
import datetime
from south.db import db
from south.v2 import SchemaMigration
from django.db import models


class Migration(SchemaMigration):

    def forwards(self, orm):
        # Adding model 'SkillSet'
        db.create_table(u'application_skillset', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('title', self.gf('django.db.models.fields.CharField')(max_length=200)),
        ))
        db.send_create_signal(u'application', ['SkillSet'])

        #we put this application_documentfiles manually to make the database work
        db.create_table(u'application_documentfiles', (
            ('filename', self.gf('django.db.models.fields.CharField')(max_length=256L, primary_key=True)),
            ('data', self.gf('django.db.models.fields.TextField')(blank=True)),
            ('size', self.gf('django.db.models.fields.IntegerField')()),
        ))
        db.send_create_signal(u'application', ['Documentfiles'])

        db.create_table(u'application_question', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('title', self.gf('django.db.models.fields.CharField')(max_length=200)),
            ('question', self.gf('django.db.models.fields.TextField')(null=True)),
        ))
        db.send_create_signal(u'application', ['Question'])

        # Adding model 'Vacancy'
        db.create_table(u'application_vacancy', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('title', self.gf('django.db.models.fields.CharField')(max_length=200)),
            ('department', self.gf('django.db.models.fields.CharField')(max_length=20)),
            ('slug', self.gf('django.db.models.fields.SlugField')(unique=True, max_length=50)),
            ('job_description_input', self.gf('django.db.models.fields.TextField')(max_length=500)),
            ('job_description_output', self.gf('django.db.models.fields.TextField')(max_length=500)),
            ('mail_text', self.gf('django.db.models.fields.TextField')(max_length=500)),
            ('mail_text2', self.gf('django.db.models.fields.TextField')(max_length=500)),
            ('question', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['application.Question'], null=True)),
            ('pub_date', self.gf('django.db.models.fields.DateTimeField')(auto_now=True, auto_now_add=True, blank=True)),
        ))
        db.send_create_signal(u'application', ['Vacancy'])

        # Adding M2M table for field skill_sets on 'Vacancy'
        m2m_table_name = db.shorten_name(u'application_vacancy_skill_sets')
        db.create_table(m2m_table_name, (
            ('id', models.AutoField(verbose_name='ID', primary_key=True, auto_created=True)),
            ('vacancy', models.ForeignKey(orm[u'application.vacancy'], null=False)),
            ('skillset', models.ForeignKey(orm[u'application.skillset'], null=False))
        ))
        db.create_unique(m2m_table_name, ['vacancy_id', 'skillset_id'])

        # Adding model 'GameInstance'
        db.create_table(u'application_gameinstance', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('uid', self.gf('django.db.models.fields.CharField')(max_length=200)),
            ('progress', self.gf('django.db.models.fields.IntegerField')(default=0)),
            ('player_position_y', self.gf('django.db.models.fields.IntegerField')(default=5)),
            ('player_position_x', self.gf('django.db.models.fields.IntegerField')(default=5)),
            ('player_cv_unlockedQuest', self.gf('django.db.models.fields.BooleanField')(default=False)),
            ('player_motivation_unlockedQuest', self.gf('django.db.models.fields.BooleanField')(default=False)),
            ('player_link_unlockedQuest', self.gf('django.db.models.fields.BooleanField')(default=False)),
            ('player_skill_unlockedQuest', self.gf('django.db.models.fields.BooleanField')(default=False)),
            ('player_finished_intro', self.gf('django.db.models.fields.BooleanField')(default=False)),
            ('player_unlocked_boss', self.gf('django.db.models.fields.BooleanField')(default=False)),
            ('player_name', self.gf('django.db.models.fields.CharField')(max_length=50, blank=True)),
            ('player_email', self.gf('django.db.models.fields.EmailField')(max_length=100, blank=True)),
            ('vacancy', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['application.Vacancy'])),
        ))
        db.send_create_signal(u'application', ['GameInstance'])

        # Adding model 'PlayerQuestion'
        db.create_table(u'application_playerquestion', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('question', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['application.Question'])),
            ('game_instance', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['application.GameInstance'])),
            ('answer', self.gf('django.db.models.fields.TextField')(null=True)),
        ))
        db.send_create_signal(u'application', ['PlayerQuestion'])

        # Adding unique constraint on 'PlayerQuestion', fields ['question', 'game_instance']
        db.create_unique(u'application_playerquestion', ['question_id', 'game_instance_id'])

        # Adding model 'PlayerSkill'
        db.create_table(u'application_playerskill', (
            ('id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('skill', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['application.SkillSet'])),
            ('game_instance', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['application.GameInstance'])),
            ('score', self.gf('django.db.models.fields.IntegerField')(default=0)),
        ))
        db.send_create_signal(u'application', ['PlayerSkill'])

        # Adding unique constraint on 'PlayerSkill', fields ['skill', 'game_instance']
        db.create_unique(u'application_playerskill', ['skill_id', 'game_instance_id'])

        # Adding model 'Meeting'
        db.create_table(u'application_meeting', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('player_name', self.gf('django.db.models.fields.CharField')(default='unknown', max_length=50)),
            ('pub_date', self.gf('django.db.models.fields.DateField')()),
            ('pub_time', self.gf('django.db.models.fields.TimeField')()),
            ('vacancy', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['application.Vacancy'])),
            ('dateID', self.gf('django.db.models.fields.SlugField')(unique=True, max_length=50)),
        ))
        db.send_create_signal(u'application', ['Meeting'])

        # Adding model 'GameData'
        db.create_table(u'application_gamedata', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('game_instance', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['application.GameInstance'])),
            ('position_x', self.gf('django.db.models.fields.IntegerField')(default=5)),
            ('position_y', self.gf('django.db.models.fields.IntegerField')(default=5)),
            ('cv_unlocked', self.gf('django.db.models.fields.BooleanField')(default=False)),
            ('motivation_unlocked', self.gf('django.db.models.fields.BooleanField')(default=False)),
        ))
        db.send_create_signal(u'application', ['GameData'])

        # Adding model 'PortfolioLink'
        db.create_table(u'application_portfoliolink', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('links', self.gf('django.db.models.fields.URLField')(max_length=200)),
            ('game_instance', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['application.GameInstance'])),
        ))
        db.send_create_signal(u'application', ['PortfolioLink'])

        # Adding model 'CvDocument'
        db.create_table(u'application_cvdocument', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('title', self.gf('django.db.models.fields.CharField')(max_length=200)),
            ('game_instance', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['application.GameInstance'])),
            ('attachment', self.gf('django.db.models.fields.files.FileField')(max_length=100)),
        ))
        db.send_create_signal(u'application', ['CvDocument'])

        # Adding model 'MotivationLetter'
        db.create_table(u'application_motivationletter', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('title', self.gf('django.db.models.fields.CharField')(max_length=50)),
            ('game_instance', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['application.GameInstance'])),
            ('entry', self.gf('django.db.models.fields.TextField')(null=True, blank=True)),
            ('attachment', self.gf('django.db.models.fields.files.FileField')(max_length=100, null=True, blank=True)),
        ))
        db.send_create_signal(u'application', ['MotivationLetter'])


    def backwards(self, orm):
        # Removing unique constraint on 'PlayerSkill', fields ['skill', 'game_instance']
        db.delete_unique(u'application_playerskill', ['skill_id', 'game_instance_id'])

        # Removing unique constraint on 'PlayerQuestion', fields ['question', 'game_instance']
        db.delete_unique(u'application_playerquestion', ['question_id', 'game_instance_id'])

        # Deleting model 'SkillSet'
        db.delete_table(u'application_skillset')

        # Deleting model 'Question'
        db.delete_table(u'application_question')

        # Deleting model 'Vacancy'
        db.delete_table(u'application_vacancy')

        # Removing M2M table for field skill_sets on 'Vacancy'
        db.delete_table(db.shorten_name(u'application_vacancy_skill_sets'))

        # Deleting model 'GameInstance'
        db.delete_table(u'application_gameinstance')

        # Deleting model 'PlayerQuestion'
        db.delete_table(u'application_playerquestion')

        # Deleting model 'PlayerSkill'
        db.delete_table(u'application_playerskill')

        # Deleting model 'Meeting'
        db.delete_table(u'application_meeting')

        # Deleting model 'GameData'
        db.delete_table(u'application_gamedata')

        # Deleting model 'PortfolioLink'
        db.delete_table(u'application_portfoliolink')

        # Deleting model 'CvDocument'
        db.delete_table(u'application_cvdocument')

        # Deleting model 'MotivationLetter'
        db.delete_table(u'application_motivationletter')


    models = {
        u'application.applicationdocumentfiles': {
            'Meta': {'object_name': 'Applicationdocumentfiles', 'db_table': "'ApplicationDocumentFiles'", 'managed': 'False'},
            'data': ('django.db.models.fields.CharField', [], {'max_length': '200'}),
            'filename': ('django.db.models.fields.CharField', [], {'max_length': '255', 'primary_key': 'True'}),
            'size': ('django.db.models.fields.IntegerField', [], {})
        },
        u'application.cvdocument': {
            'Meta': {'object_name': 'CvDocument'},
            'attachment': ('django.db.models.fields.files.FileField', [], {'max_length': '100'}),
            'game_instance': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['application.GameInstance']"}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'title': ('django.db.models.fields.CharField', [], {'max_length': '200'})
        },
        u'application.gamedata': {
            'Meta': {'object_name': 'GameData'},
            'cv_unlocked': ('django.db.models.fields.BooleanField', [], {'default': 'False'}),
            'game_instance': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['application.GameInstance']"}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'motivation_unlocked': ('django.db.models.fields.BooleanField', [], {'default': 'False'}),
            'position_x': ('django.db.models.fields.IntegerField', [], {'default': '5'}),
            'position_y': ('django.db.models.fields.IntegerField', [], {'default': '5'})
        },
        u'application.gameinstance': {
            'Meta': {'object_name': 'GameInstance'},
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'player_cv_unlockedQuest': ('django.db.models.fields.BooleanField', [], {'default': 'False'}),
            'player_email': ('django.db.models.fields.EmailField', [], {'max_length': '100', 'blank': 'True'}),
            'player_finished_intro': ('django.db.models.fields.BooleanField', [], {'default': 'False'}),
            'player_link_unlockedQuest': ('django.db.models.fields.BooleanField', [], {'default': 'False'}),
            'player_motivation_unlockedQuest': ('django.db.models.fields.BooleanField', [], {'default': 'False'}),
            'player_name': ('django.db.models.fields.CharField', [], {'max_length': '50', 'blank': 'True'}),
            'player_position_x': ('django.db.models.fields.IntegerField', [], {'default': '5'}),
            'player_position_y': ('django.db.models.fields.IntegerField', [], {'default': '5'}),
            'player_skill_unlockedQuest': ('django.db.models.fields.BooleanField', [], {'default': 'False'}),
            'player_unlocked_boss': ('django.db.models.fields.BooleanField', [], {'default': 'False'}),
            'progress': ('django.db.models.fields.IntegerField', [], {'default': '0'}),
            'uid': ('django.db.models.fields.CharField', [], {'max_length': '200'}),
            'vacancy': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['application.Vacancy']"})
        },
        u'application.meeting': {
            'Meta': {'object_name': 'Meeting'},
            'dateID': ('django.db.models.fields.SlugField', [], {'unique': 'True', 'max_length': '50'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'player_name': ('django.db.models.fields.CharField', [], {'default': "'unknown'", 'max_length': '50'}),
            'pub_date': ('django.db.models.fields.DateField', [], {}),
            'pub_time': ('django.db.models.fields.TimeField', [], {}),
            'vacancy': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['application.Vacancy']"})
        },
        u'application.motivationletter': {
            'Meta': {'object_name': 'MotivationLetter'},
            'attachment': ('django.db.models.fields.files.FileField', [], {'max_length': '100', 'null': 'True', 'blank': 'True'}),
            'entry': ('django.db.models.fields.TextField', [], {'null': 'True', 'blank': 'True'}),
            'game_instance': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['application.GameInstance']"}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'title': ('django.db.models.fields.CharField', [], {'max_length': '50'})
        },
        u'application.playerquestion': {
            'Meta': {'unique_together': "(('question', 'game_instance'),)", 'object_name': 'PlayerQuestion'},
            'answer': ('django.db.models.fields.TextField', [], {'null': 'True'}),
            'game_instance': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['application.GameInstance']"}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'question': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['application.Question']"})
        },
        u'application.playerskill': {
            'Meta': {'unique_together': "(('skill', 'game_instance'),)", 'object_name': 'PlayerSkill'},
            'game_instance': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['application.GameInstance']"}),
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'score': ('django.db.models.fields.IntegerField', [], {'default': '0'}),
            'skill': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['application.SkillSet']"})
        },
        u'application.portfoliolink': {
            'Meta': {'object_name': 'PortfolioLink'},
            'game_instance': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['application.GameInstance']"}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'links': ('django.db.models.fields.URLField', [], {'max_length': '200'})
        },
        u'application.question': {
            'Meta': {'object_name': 'Question'},
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'question': ('django.db.models.fields.TextField', [], {'null': 'True'}),
            'title': ('django.db.models.fields.CharField', [], {'max_length': '200'})
        },
        u'application.skillset': {
            'Meta': {'object_name': 'SkillSet'},
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'title': ('django.db.models.fields.CharField', [], {'max_length': '200'})
        },
        u'application.vacancy': {
            'Meta': {'object_name': 'Vacancy'},
            'department': ('django.db.models.fields.CharField', [], {'max_length': '20'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'job_description_input': ('django.db.models.fields.TextField', [], {'max_length': '500'}),
            'job_description_output': ('django.db.models.fields.TextField', [], {'max_length': '500'}),
            'mail_text': ('django.db.models.fields.TextField', [], {'max_length': '500'}),
            'mail_text2': ('django.db.models.fields.TextField', [], {'max_length': '500'}),
            'pub_date': ('django.db.models.fields.DateTimeField', [], {'auto_now': 'True', 'auto_now_add': 'True', 'blank': 'True'}),
            'question': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['application.Question']", 'null': 'True'}),
            'skill_sets': ('django.db.models.fields.related.ManyToManyField', [], {'to': u"orm['application.SkillSet']", 'symmetrical': 'False'}),
            'slug': ('django.db.models.fields.SlugField', [], {'unique': 'True', 'max_length': '50'}),
            'title': ('django.db.models.fields.CharField', [], {'max_length': '200'})
        }
    }

    complete_apps = ['application']